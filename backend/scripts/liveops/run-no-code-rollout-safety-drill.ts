import fs from 'node:fs/promises';
import path from 'node:path';

const backendRoot = path.resolve(__dirname, '..', '..');
const repoRoot = path.resolve(backendRoot, '..');

type DrillStatus = 'pass' | 'fail';

type RolloutSafetyPolicy = {
  schemaVersion: number;
  description: string;
  targeting: {
    requireAllowlistedSegmentsOnly: boolean;
    allowedSegments: string[];
    forbiddenSegments: string[];
  };
  guardrails: {
    maxInitialRolloutPercent: number;
    maxDailyRolloutIncreasePercent: number;
    requireErrorBudgetGuardrail: boolean;
    maxErrorRatePercent: number;
    maxCrashRatePercent: number;
    maxP95LatencyMs: number;
  };
  rollback: {
    required: boolean;
    maxRollbackTimeSeconds: number;
    requireRollbackOwner: boolean;
  };
  blockPublishOnViolation: boolean;
};

type RolloutPlan = {
  id: string;
  targetingSegments: string[];
  initialRolloutPercent: number;
  dailyRolloutIncreasePercent: number;
  guardrails: {
    errorRatePercent: number;
    crashRatePercent: number;
    p95LatencyMs: number;
    errorBudgetGuardrailEnabled: boolean;
  };
  rollbackPlan: {
    enabled: boolean;
    rollbackOwner?: string;
    expectedRollbackSeconds?: number;
  };
};

type PlanEvaluation = {
  scenario: 'valid' | 'invalid';
  publishDecision: 'allow' | 'block';
  violations: string[];
};

type DrillArtifact = {
  schemaVersion: number;
  pipeline: 'NC-03';
  status: DrillStatus;
  generatedAt: string;
  runId: string;
  policyPath: string;
  reportPath: string;
  rolloutPlanPath: string;
  policy: RolloutSafetyPolicy;
  checks: Array<{
    name: string;
    status: DrillStatus;
    details: string;
  }>;
  validScenario: {
    plan: RolloutPlan;
    evaluation: PlanEvaluation;
  };
  invalidScenario: {
    plan: RolloutPlan;
    evaluation: PlanEvaluation;
  };
};

function parseArgs(argv: string[]): Record<string, string> {
  return argv.reduce<Record<string, string>>((accumulator, argument) => {
    const [rawKey, ...rest] = argument.split('=');
    if (!rawKey?.startsWith('--') || rest.length === 0) {
      return accumulator;
    }
    accumulator[rawKey.slice(2)] = rest.join('=');
    return accumulator;
  }, {});
}

function utcTimestampCompact(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

async function readPolicy(policyPath: string): Promise<RolloutSafetyPolicy> {
  const raw = await fs.readFile(policyPath, 'utf8');
  return JSON.parse(raw) as RolloutSafetyPolicy;
}

function evaluatePlan(
  scenario: 'valid' | 'invalid',
  plan: RolloutPlan,
  policy: RolloutSafetyPolicy,
): PlanEvaluation {
  const violations: string[] = [];

  if (policy.targeting.requireAllowlistedSegmentsOnly) {
    const disallowed = plan.targetingSegments.filter(
      (segment) => !policy.targeting.allowedSegments.includes(segment),
    );
    if (disallowed.length > 0) {
      violations.push(`disallowed_segments:${disallowed.join(',')}`);
    }
  }

  const forbidden = plan.targetingSegments.filter((segment) =>
    policy.targeting.forbiddenSegments.includes(segment),
  );
  if (forbidden.length > 0) {
    violations.push(`forbidden_segments:${forbidden.join(',')}`);
  }

  if (plan.initialRolloutPercent > policy.guardrails.maxInitialRolloutPercent) {
    violations.push(
      `initial_rollout_percent:${plan.initialRolloutPercent}>${policy.guardrails.maxInitialRolloutPercent}`,
    );
  }

  if (plan.dailyRolloutIncreasePercent > policy.guardrails.maxDailyRolloutIncreasePercent) {
    violations.push(
      `daily_rollout_increase_percent:${plan.dailyRolloutIncreasePercent}>${policy.guardrails.maxDailyRolloutIncreasePercent}`,
    );
  }

  if (policy.guardrails.requireErrorBudgetGuardrail && !plan.guardrails.errorBudgetGuardrailEnabled) {
    violations.push('missing_error_budget_guardrail');
  }

  if (plan.guardrails.errorRatePercent > policy.guardrails.maxErrorRatePercent) {
    violations.push(`error_rate_percent:${plan.guardrails.errorRatePercent}>${policy.guardrails.maxErrorRatePercent}`);
  }

  if (plan.guardrails.crashRatePercent > policy.guardrails.maxCrashRatePercent) {
    violations.push(`crash_rate_percent:${plan.guardrails.crashRatePercent}>${policy.guardrails.maxCrashRatePercent}`);
  }

  if (plan.guardrails.p95LatencyMs > policy.guardrails.maxP95LatencyMs) {
    violations.push(`p95_latency_ms:${plan.guardrails.p95LatencyMs}>${policy.guardrails.maxP95LatencyMs}`);
  }

  if (policy.rollback.required && !plan.rollbackPlan.enabled) {
    violations.push('missing_rollback_plan');
  }

  if (policy.rollback.requireRollbackOwner && !plan.rollbackPlan.rollbackOwner) {
    violations.push('missing_rollback_owner');
  }

  if (
    policy.rollback.required &&
    typeof plan.rollbackPlan.expectedRollbackSeconds === 'number' &&
    plan.rollbackPlan.expectedRollbackSeconds > policy.rollback.maxRollbackTimeSeconds
  ) {
    violations.push(
      `rollback_time_seconds:${plan.rollbackPlan.expectedRollbackSeconds}>${policy.rollback.maxRollbackTimeSeconds}`,
    );
  }

  const publishDecision: 'allow' | 'block' =
    policy.blockPublishOnViolation && violations.length > 0 ? 'block' : 'allow';

  return {
    scenario,
    publishDecision,
    violations,
  };
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const timestamp = utcTimestampCompact(new Date());
  const runId = `no-code-rollout-safety-${timestamp}`;

  const policyPath = path.resolve(
    args.policyPath ?? path.join(repoRoot, 'governance/policies/no-code-rollout-safety-policy.json'),
  );
  const reportPath = path.resolve(
    args.reportDir ?? path.join(backendRoot, 'tmp/liveops-artifacts'),
    `nc-03-rollout-safety-${timestamp}.json`,
  );
  const rolloutPlanPath = path.resolve(
    args.workDir ?? path.join(backendRoot, 'tmp/liveops-rollout-safety', runId),
    'rollout-plans.json',
  );

  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.mkdir(path.dirname(rolloutPlanPath), { recursive: true });

  const policy = await readPolicy(policyPath);

  const validPlan: RolloutPlan = {
    id: 'ROLL-VALID-001',
    targetingSegments: ['new_players', 'returning_players'],
    initialRolloutPercent: 15,
    dailyRolloutIncreasePercent: 10,
    guardrails: {
      errorRatePercent: 0.7,
      crashRatePercent: 0.15,
      p95LatencyMs: 260,
      errorBudgetGuardrailEnabled: true,
    },
    rollbackPlan: {
      enabled: true,
      rollbackOwner: 'sre-owner',
      expectedRollbackSeconds: 120,
    },
  };

  const invalidPlan: RolloutPlan = {
    id: 'ROLL-INVALID-001',
    targetingSegments: ['returning_players', 'whales_high_value'],
    initialRolloutPercent: 40,
    dailyRolloutIncreasePercent: 35,
    guardrails: {
      errorRatePercent: 2.4,
      crashRatePercent: 0.9,
      p95LatencyMs: 510,
      errorBudgetGuardrailEnabled: false,
    },
    rollbackPlan: {
      enabled: true,
      expectedRollbackSeconds: 420,
    },
  };

  const validEvaluation = evaluatePlan('valid', validPlan, policy);
  const invalidEvaluation = evaluatePlan('invalid', invalidPlan, policy);

  await fs.writeFile(
    rolloutPlanPath,
    JSON.stringify(
      {
        schemaVersion: 1,
        runId,
        generatedAt: new Date().toISOString(),
        valid: { plan: validPlan, evaluation: validEvaluation },
        invalid: { plan: invalidPlan, evaluation: invalidEvaluation },
      },
      null,
      2,
    ),
    'utf8',
  );

  const checks: DrillArtifact['checks'] = [
    {
      name: 'valid-plan-allowed',
      status: validEvaluation.publishDecision === 'allow' ? 'pass' : 'fail',
      details: `decision=${validEvaluation.publishDecision}`,
    },
    {
      name: 'invalid-plan-blocked',
      status: invalidEvaluation.publishDecision === 'block' ? 'pass' : 'fail',
      details: invalidEvaluation.violations.join(', ') || 'no_violations',
    },
    {
      name: 'invalid-plan-has-targeting-guardrail-rollback-violations',
      status:
        invalidEvaluation.violations.some((value) => value.startsWith('forbidden_segments')) &&
        invalidEvaluation.violations.some((value) => value.startsWith('initial_rollout_percent')) &&
        invalidEvaluation.violations.some((value) => value.startsWith('rollback_time_seconds'))
          ? 'pass'
          : 'fail',
      details: invalidEvaluation.violations.join(', ') || 'no_violations',
    },
  ];

  const status: DrillStatus = checks.every((check) => check.status === 'pass') ? 'pass' : 'fail';

  const artifact: DrillArtifact = {
    schemaVersion: 1,
    pipeline: 'NC-03',
    status,
    generatedAt: new Date().toISOString(),
    runId,
    policyPath,
    reportPath,
    rolloutPlanPath,
    policy,
    checks,
    validScenario: {
      plan: validPlan,
      evaluation: validEvaluation,
    },
    invalidScenario: {
      plan: invalidPlan,
      evaluation: invalidEvaluation,
    },
  };

  await fs.writeFile(reportPath, JSON.stringify(artifact, null, 2), 'utf8');
  console.log(JSON.stringify(artifact, null, 2));

  if (status === 'fail') {
    process.exit(1);
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'unknown_error';
  console.error(JSON.stringify({ error: message }, null, 2));
  process.exit(1);
});

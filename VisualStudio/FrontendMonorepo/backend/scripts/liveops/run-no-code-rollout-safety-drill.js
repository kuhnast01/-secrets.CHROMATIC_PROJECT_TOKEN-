"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const backendRoot = node_path_1.default.resolve(__dirname, '..', '..');
const repoRoot = node_path_1.default.resolve(backendRoot, '..');
function parseArgs(argv) {
    return argv.reduce((accumulator, argument) => {
        const [rawKey, ...rest] = argument.split('=');
        if (!rawKey?.startsWith('--') || rest.length === 0) {
            return accumulator;
        }
        accumulator[rawKey.slice(2)] = rest.join('=');
        return accumulator;
    }, {});
}
function utcTimestampCompact(date) {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}
async function readPolicy(policyPath) {
    const raw = await promises_1.default.readFile(policyPath, 'utf8');
    return JSON.parse(raw);
}
function evaluatePlan(scenario, plan, policy) {
    const violations = [];
    if (policy.targeting.requireAllowlistedSegmentsOnly) {
        const disallowed = plan.targetingSegments.filter((segment) => !policy.targeting.allowedSegments.includes(segment));
        if (disallowed.length > 0) {
            violations.push(`disallowed_segments:${disallowed.join(',')}`);
        }
    }
    const forbidden = plan.targetingSegments.filter((segment) => policy.targeting.forbiddenSegments.includes(segment));
    if (forbidden.length > 0) {
        violations.push(`forbidden_segments:${forbidden.join(',')}`);
    }
    if (plan.initialRolloutPercent > policy.guardrails.maxInitialRolloutPercent) {
        violations.push(`initial_rollout_percent:${plan.initialRolloutPercent}>${policy.guardrails.maxInitialRolloutPercent}`);
    }
    if (plan.dailyRolloutIncreasePercent > policy.guardrails.maxDailyRolloutIncreasePercent) {
        violations.push(`daily_rollout_increase_percent:${plan.dailyRolloutIncreasePercent}>${policy.guardrails.maxDailyRolloutIncreasePercent}`);
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
    if (policy.rollback.required &&
        typeof plan.rollbackPlan.expectedRollbackSeconds === 'number' &&
        plan.rollbackPlan.expectedRollbackSeconds > policy.rollback.maxRollbackTimeSeconds) {
        violations.push(`rollback_time_seconds:${plan.rollbackPlan.expectedRollbackSeconds}>${policy.rollback.maxRollbackTimeSeconds}`);
    }
    const publishDecision = policy.blockPublishOnViolation && violations.length > 0 ? 'block' : 'allow';
    return {
        scenario,
        publishDecision,
        violations,
    };
}
async function main() {
    const args = parseArgs(process.argv.slice(2));
    const timestamp = utcTimestampCompact(new Date());
    const runId = `no-code-rollout-safety-${timestamp}`;
    const policyPath = node_path_1.default.resolve(args.policyPath ?? node_path_1.default.join(repoRoot, 'governance/policies/no-code-rollout-safety-policy.json'));
    const reportPath = node_path_1.default.resolve(args.reportDir ?? node_path_1.default.join(backendRoot, 'tmp/liveops-artifacts'), `nc-03-rollout-safety-${timestamp}.json`);
    const rolloutPlanPath = node_path_1.default.resolve(args.workDir ?? node_path_1.default.join(backendRoot, 'tmp/liveops-rollout-safety', runId), 'rollout-plans.json');
    await promises_1.default.mkdir(node_path_1.default.dirname(reportPath), { recursive: true });
    await promises_1.default.mkdir(node_path_1.default.dirname(rolloutPlanPath), { recursive: true });
    const policy = await readPolicy(policyPath);
    const validPlan = {
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
    const invalidPlan = {
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
    await promises_1.default.writeFile(rolloutPlanPath, JSON.stringify({
        schemaVersion: 1,
        runId,
        generatedAt: new Date().toISOString(),
        valid: { plan: validPlan, evaluation: validEvaluation },
        invalid: { plan: invalidPlan, evaluation: invalidEvaluation },
    }, null, 2), 'utf8');
    const checks = [
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
            status: invalidEvaluation.violations.some((value) => value.startsWith('forbidden_segments')) &&
                invalidEvaluation.violations.some((value) => value.startsWith('initial_rollout_percent')) &&
                invalidEvaluation.violations.some((value) => value.startsWith('rollback_time_seconds'))
                ? 'pass'
                : 'fail',
            details: invalidEvaluation.violations.join(', ') || 'no_violations',
        },
    ];
    const status = checks.every((check) => check.status === 'pass') ? 'pass' : 'fail';
    const artifact = {
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
    await promises_1.default.writeFile(reportPath, JSON.stringify(artifact, null, 2), 'utf8');
    console.log(JSON.stringify(artifact, null, 2));
    if (status === 'fail') {
        process.exit(1);
    }
}
main().catch((error) => {
    const message = error instanceof Error ? error.message : 'unknown_error';
    console.error(JSON.stringify({ error: message }, null, 2));
    process.exit(1);
});

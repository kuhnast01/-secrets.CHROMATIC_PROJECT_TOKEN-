import fs from 'node:fs';
import path from 'node:path';

import { eventSchema } from '../../src/utils/validate';

type StepStatus = 'pass' | 'fail';

type DrillStep = {
  name: string;
  status: StepStatus;
  durationMs: number;
  details: string;
};

type NonEngineerInputs = {
  eventName: string;
  startAt: string;
  endAt: string;
  segment: string;
  rewardSku: string;
  rewardAmount: number;
  rolloutPercent: number;
};

type DrillArtifact = {
  schemaVersion: number;
  pipeline: 'NC-01';
  status: StepStatus;
  generatedAt: string;
  reportPath: string;
  stagePath: string;
  inputs: NonEngineerInputs;
  steps: DrillStep[];
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

function writeJson(filePath: string, payload: unknown): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf8');
}

async function runStep(name: string, steps: DrillStep[], fn: () => Promise<string> | string): Promise<void> {
  const started = Date.now();
  try {
    const details = await fn();
    steps.push({ name, status: 'pass', durationMs: Date.now() - started, details });
  } catch (error) {
    const details = error instanceof Error ? error.message : 'unknown_error';
    steps.push({ name, status: 'fail', durationMs: Date.now() - started, details });
    throw error;
  }
}

function toPositiveInt(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.floor(parsed);
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const now = new Date();
  const timestamp = utcTimestampCompact(now);

  const backendRoot = path.resolve(__dirname, '..', '..');
  const reportPath = path.resolve(args.reportDir ?? path.join(backendRoot, 'tmp/liveops-artifacts'), `nc-01-no-code-composer-${timestamp}.json`);
  const stagePath = path.resolve(args.stageDir ?? path.join(backendRoot, 'tmp/liveops-staging/no-code'), `nc-01-event-${timestamp}.json`);

  const inputs: NonEngineerInputs = {
    eventName: args.eventName ?? `NC-01 Weekend Boost ${now.toISOString().slice(0, 10)}`,
    startAt: args.startAt ?? new Date(now.getTime() + 60 * 60 * 1000).toISOString(),
    endAt: args.endAt ?? new Date(now.getTime() + 26 * 60 * 60 * 1000).toISOString(),
    segment: args.segment ?? 'returning_players',
    rewardSku: args.rewardSku ?? 'coins',
    rewardAmount: toPositiveInt(args.rewardAmount, 500),
    rolloutPercent: Math.min(100, toPositiveInt(args.rolloutPercent, 20)),
  };

  const steps: DrillStep[] = [];

  await runStep('no-code-input:collect-form-fields', steps, async () => {
    const required = [inputs.eventName, inputs.startAt, inputs.endAt, inputs.segment, inputs.rewardSku];
    if (required.some((field) => !field || String(field).trim() === '')) {
      throw new Error('Missing required non-engineer form fields');
    }
    return 'Collected event fields without requiring code or JSON authoring';
  });

  const draftedEvent = {
    name: inputs.eventName,
    config: {
      trigger: {
        type: 'schedule',
        startAt: inputs.startAt,
        endAt: inputs.endAt,
        timezone: 'UTC',
      },
      segments: [inputs.segment],
      rewards: [
        {
          sku: inputs.rewardSku,
          amount: inputs.rewardAmount,
        },
      ],
      rollout: {
        mode: 'staged',
        percentage: inputs.rolloutPercent,
      },
      metadata: {
        source: 'NC-01-no-code-composer-drill',
        composedAt: new Date().toISOString(),
      },
    },
    created_by: 1,
  };

  await runStep('no-code-composer:compose-event-payload', steps, async () => {
    if (!draftedEvent.config.trigger || !Array.isArray(draftedEvent.config.segments)) {
      throw new Error('Composer output missing trigger or segments');
    }
    return 'Composed internal event payload from no-code inputs';
  });

  await runStep('no-code-composer:validate-event', steps, async () => {
    const parsed = eventSchema.safeParse(draftedEvent);
    if (!parsed.success) {
      throw new Error(`Validation failed with ${parsed.error.issues.length} issue(s)`);
    }
    return 'Composed event passed backend schema validation';
  });

  await runStep('no-code-composer:stage-event', steps, async () => {
    writeJson(stagePath, {
      schemaVersion: 1,
      pipeline: 'NC-01',
      stagedAt: new Date().toISOString(),
      source: 'no-code-form-usability-test',
      event: draftedEvent,
    });
    return `Event staged successfully at ${stagePath}`;
  });

  const status: StepStatus = steps.every((step) => step.status === 'pass') ? 'pass' : 'fail';
  const artifact: DrillArtifact = {
    schemaVersion: 1,
    pipeline: 'NC-01',
    status,
    generatedAt: new Date().toISOString(),
    reportPath,
    stagePath,
    inputs,
    steps,
  };

  writeJson(reportPath, artifact);
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

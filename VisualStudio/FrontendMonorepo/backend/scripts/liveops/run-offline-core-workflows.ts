import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import https from 'node:https';

import request from 'supertest';

import app from '../../src/index';
import { eventSchema } from '../../src/utils/validate';

type StepStatus = 'pass' | 'fail';

type OfflineStep = {
  name: string;
  status: StepStatus;
  durationMs: number;
  details: string;
};

type OfflineArtifact = {
  schemaVersion: number;
  pipeline: 'LOCAL-01';
  status: StepStatus;
  generatedAt: string;
  reportPath: string;
  stagedEventPath?: string;
  steps: OfflineStep[];
};

type ArgMap = Record<string, string>;

type NodeRequestModule = {
  request: (...args: unknown[]) => unknown;
  get: (...args: unknown[]) => unknown;
};

const ALLOWED_LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1']);

function parseArgs(argv: string[]): ArgMap {
  return argv.reduce<ArgMap>((accumulator, argument) => {
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

function parseHost(candidate: unknown): string {
  if (typeof candidate === 'string') {
    try {
      const url = new URL(candidate);
      return url.hostname;
    } catch {
      return 'localhost';
    }
  }

  if (candidate && typeof candidate === 'object') {
    const options = candidate as { hostname?: string; host?: string };
    const host = options.hostname || options.host || 'localhost';
    return host.split(':')[0] || 'localhost';
  }

  return 'localhost';
}

function isExternalHost(host: string): boolean {
  return !ALLOWED_LOCAL_HOSTS.has(host.toLowerCase());
}

function installOfflineNetworkGuard(moduleRef: NodeRequestModule): () => void {
  const originalRequest = moduleRef.request;
  const originalGet = moduleRef.get;

  moduleRef.request = (...args: unknown[]) => {
    const host = parseHost(args[0]);
    if (isExternalHost(host)) {
      throw new Error(`OFFLINE_EXTERNAL_BLOCKED:${host}`);
    }

    return originalRequest.apply(moduleRef as unknown as object, args as Parameters<typeof originalRequest>);
  };

  moduleRef.get = (...args: unknown[]) => {
    const host = parseHost(args[0]);
    if (isExternalHost(host)) {
      throw new Error(`OFFLINE_EXTERNAL_BLOCKED:${host}`);
    }

    return originalGet.apply(moduleRef as unknown as object, args as Parameters<typeof originalGet>);
  };

  return () => {
    moduleRef.request = originalRequest;
    moduleRef.get = originalGet;
  };
}

function writeJsonFile(filePath: string, payload: unknown): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf8');
}

async function runStep(name: string, steps: OfflineStep[], fn: () => Promise<string> | string): Promise<void> {
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

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const now = new Date();
  const timestamp = utcTimestampCompact(now);

  const reportDir = path.resolve(args.reportDir ?? 'tmp/liveops-artifacts');
  const stagingDir = path.resolve(args.stageDir ?? 'tmp/liveops-staging/offline');
  const reportPath = path.resolve(reportDir, `local-01-offline-core-workflows-${timestamp}.json`);

  process.env.POSEIDON_OFFLINE_MODE = 'strict';
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'offline-local-01-secret';

  const steps: OfflineStep[] = [];
  const restoreHttp = installOfflineNetworkGuard(http as unknown as NodeRequestModule);
  const restoreHttps = installOfflineNetworkGuard(https as unknown as NodeRequestModule);

  let stagedEventPath: string | undefined;

  try {
    await runStep('offline-guard:external-network-blocked', steps, async () => {
      try {
        https.get('https://example.com');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'unknown_error';
        if (message.startsWith('OFFLINE_EXTERNAL_BLOCKED:')) {
          return 'Outbound external request was blocked as expected';
        }

        throw error;
      }

      throw new Error('External request unexpectedly bypassed offline guard');
    });

    await runStep('core-workflow:healthz', steps, async () => {
      const response = await request(app).get('/healthz').expect(200);
      if (response.body?.status !== 'ok') {
        throw new Error('Unexpected /healthz response');
      }
      return 'GET /healthz returned ok';
    });

    await runStep('core-workflow:system-health', steps, async () => {
      const response = await request(app).get('/system-health').expect(200);
      if (response.body?.status !== 'ok') {
        throw new Error('Unexpected /system-health response');
      }
      return 'GET /system-health returned ok';
    });

    await runStep('core-workflow:auth-login', steps, async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ username: 'admin', password: 'admin123' })
        .expect(200);

      const token = response.body?.token;
      if (!token || typeof token !== 'string') {
        throw new Error('Login token missing');
      }

      return 'POST /auth/login succeeded with token issuance';
    });

    await runStep('core-workflow:event-author-validate-stage', steps, async () => {
      const draft = {
        name: `LOCAL-01 Event ${now.toISOString().slice(0, 10)}`,
        config: {
          trigger: { type: 'manual' },
          segments: ['all_players'],
          metadata: {
            source: 'LOCAL-01-offline-drill',
            generatedAt: new Date().toISOString(),
          },
        },
        created_by: 1,
      };

      const parsed = eventSchema.safeParse(draft);
      if (!parsed.success) {
        throw new Error(`Event schema validation failed with ${parsed.error.issues.length} issue(s)`);
      }

      stagedEventPath = path.resolve(stagingDir, `local-01-event-${timestamp}.json`);
      writeJsonFile(stagedEventPath, {
        schemaVersion: 1,
        pipeline: 'LOCAL-01',
        stagedAt: new Date().toISOString(),
        event: parsed.data,
      });

      return `Event draft validated and staged to ${stagedEventPath}`;
    });
  } finally {
    restoreHttp();
    restoreHttps();
  }

  const status: StepStatus = steps.every((step) => step.status === 'pass') ? 'pass' : 'fail';

  const artifact: OfflineArtifact = {
    schemaVersion: 1,
    pipeline: 'LOCAL-01',
    status,
    generatedAt: new Date().toISOString(),
    reportPath,
    stagedEventPath,
    steps,
  };

  writeJsonFile(reportPath, artifact);
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

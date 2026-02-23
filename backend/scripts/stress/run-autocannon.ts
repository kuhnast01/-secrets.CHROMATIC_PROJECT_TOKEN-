import autocannon from 'autocannon';
import { once } from 'node:events';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

type ProfileName = 'smoke' | 'spike' | 'soak';

type Thresholds = {
  maxErrorRate: number;
  maxP95Ms: number;
  minRequests: number;
};

type ProfileConfig = {
  duration: number;
  connections: number;
  pipelining: number;
  thresholds: Thresholds;
};

type ScenarioResult = {
  path: string;
  total: number;
  errors: number;
  non2xx: number;
  p95: number;
  errorRate: number;
  passed: boolean;
};

const profileArg = (process.argv[2] || 'smoke') as ProfileName;
const baseUrl = process.env.BACKEND_BASE_URL || 'http://127.0.0.1:4000';
const reportPath = process.env.STRESS_REPORT_PATH;

const cliOverrides = process.argv.slice(3).reduce<Record<string, string>>((acc, arg) => {
  if (arg.startsWith('--') && arg.includes('=')) {
    const [key, value] = arg.slice(2).split('=', 2);
    acc[key] = value;
  }
  return acc;
}, {});

const profiles: Record<ProfileName, ProfileConfig> = {
  smoke: {
    duration: Number(process.env.STRESS_DURATION_SECONDS || 30),
    connections: Number(process.env.STRESS_CONNECTIONS || 20),
    pipelining: Number(process.env.STRESS_PIPELINING || 1),
    thresholds: {
      maxErrorRate: 0.01,
      maxP95Ms: 300,
      minRequests: 500
    }
  },
  spike: {
    duration: Number(process.env.STRESS_DURATION_SECONDS || 60),
    connections: Number(process.env.STRESS_CONNECTIONS || 100),
    pipelining: Number(process.env.STRESS_PIPELINING || 1),
    thresholds: {
      maxErrorRate: 0.02,
      maxP95Ms: 700,
      minRequests: 1500
    }
  },
  soak: {
    duration: Number(process.env.STRESS_DURATION_SECONDS || 300),
    connections: Number(process.env.STRESS_CONNECTIONS || 40),
    pipelining: Number(process.env.STRESS_PIPELINING || 1),
    thresholds: {
      maxErrorRate: 0.01,
      maxP95Ms: 500,
      minRequests: 3000
    }
  }
};

function applyNumberOverride(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const endpoints = ['/healthz', '/system-health'];

function safeMs(value?: number): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return Number.POSITIVE_INFINITY;
  }
  return value;
}

function extractP95(latency: Record<string, unknown> | undefined): number {
  if (!latency) return Number.POSITIVE_INFINITY;

  const candidate =
    (latency.p95 as number | undefined) ??
    (latency['95'] as number | undefined) ??
    (latency.p97_5 as number | undefined) ??
    (latency['97.5'] as number | undefined) ??
    (latency.average as number | undefined);

  return safeMs(candidate);
}

async function runScenario(path: string, config: ProfileConfig): Promise<ScenarioResult> {
  const instance = autocannon({
    url: `${baseUrl}${path}`,
    duration: config.duration,
    connections: config.connections,
    pipelining: config.pipelining,
    method: 'GET',
    timeout: 15
  });

  autocannon.track(instance, { renderProgressBar: true, renderLatencyTable: true });
  const [result] = await once(instance, 'done');

  const total = typeof result.requests?.total === 'number' ? result.requests.total : 0;
  const errors = Number(result.errors || 0);
  const non2xx = Number(result.non2xx || 0);
  const p95 = extractP95(result.latency as Record<string, unknown> | undefined);
  const errorRate = total > 0 ? (errors + non2xx) / total : 1;

  const passed =
    errorRate <= config.thresholds.maxErrorRate &&
    p95 <= config.thresholds.maxP95Ms &&
    total >= config.thresholds.minRequests;

  return { path, total, errors, non2xx, p95, errorRate, passed };
}

async function main(): Promise<void> {
  const profileConfig = profiles[profileArg];

  if (!profileConfig) {
    const options = Object.keys(profiles).join(', ');
    throw new Error(`Unknown profile: ${profileArg}. Use one of: ${options}`);
  }

  const config: ProfileConfig = {
    ...profileConfig,
    duration: applyNumberOverride(cliOverrides.duration, profileConfig.duration),
    connections: applyNumberOverride(cliOverrides.connections, profileConfig.connections),
    pipelining: applyNumberOverride(cliOverrides.pipelining, profileConfig.pipelining)
  };

  console.log(`Running '${profileArg}' stress profile against ${baseUrl}`);
  console.log(`Connections=${config.connections}, Duration=${config.duration}s, Pipelining=${config.pipelining}`);

  const results: ScenarioResult[] = [];

  for (const path of endpoints) {
    console.log(`\n--- Scenario: GET ${path} ---`);
    const result = await runScenario(path, config);
    results.push(result);
  }

  console.log('\n=== Stress Test Summary ===');
  for (const result of results) {
    const status = result.passed ? 'PASS' : 'FAIL';
    console.log(
      `${status} ${result.path} | total=${result.total} p95=${Math.round(result.p95)}ms errorRate=${(
        result.errorRate * 100
      ).toFixed(2)}% errors=${result.errors} non2xx=${result.non2xx}`
    );
  }

  const failed = results.filter((result) => !result.passed);

  if (reportPath) {
    const report = {
      profile: profileArg,
      baseUrl,
      generatedAt: new Date().toISOString(),
      config,
      results,
      passed: failed.length === 0
    };

    mkdirSync(dirname(reportPath), { recursive: true });
    writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`Saved stress report to ${reportPath}`);
  }

  if (failed.length > 0) {
    throw new Error('One or more stress scenarios failed thresholds.');
  }

  console.log('\nAll stress scenarios passed thresholds.');
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const RELEASE_DIR = path.resolve(REPO_ROOT, 'tmp/liveops-release');
const ACTIVE_RELEASE_PATH = path.resolve(RELEASE_DIR, 'active-release.json');
const ARTIFACT_DIR = path.resolve(REPO_ROOT, 'tmp/liveops-artifacts');

type StepStatus = 'pass' | 'fail';

type DrillStep = {
  name: string;
  status: StepStatus;
  durationMs: number;
  details: string;
};

type ReleaseState = {
  releaseId: string;
  promotedAt: string;
  source: string;
};

type DrillArtifact = {
  schemaVersion: number;
  pipeline: 'AUTO-03';
  status: StepStatus;
  generatedAt: string;
  reportPath: string;
  releaseStatePath: string;
  previousRelease: ReleaseState;
  deployedRelease: ReleaseState;
  finalRelease: ReleaseState;
  steps: DrillStep[];
};

function utcTimestampCompact(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

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

function ensureDirectory(dirPath: string): void {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readJsonFile<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw) as T;
}

function writeJsonFile(filePath: string, payload: unknown): void {
  ensureDirectory(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf8');
}

function getOrCreatePreviousRelease(now: Date): ReleaseState {
  if (fs.existsSync(ACTIVE_RELEASE_PATH)) {
    return readJsonFile<ReleaseState>(ACTIVE_RELEASE_PATH);
  }

  const seedRelease: ReleaseState = {
    releaseId: `baseline-${utcTimestampCompact(now)}`,
    promotedAt: now.toISOString(),
    source: 'seeded-by-auto-03-drill',
  };

  writeJsonFile(ACTIVE_RELEASE_PATH, seedRelease);
  return seedRelease;
}

function runCommand(command: string): Promise<{ exitCode: number; durationMs: number }> {
  return new Promise((resolve) => {
    const startedAtMs = Date.now();
    const child = spawn(command, {
      cwd: REPO_ROOT,
      shell: true,
      stdio: 'inherit',
      env: process.env,
    });

    child.on('error', () => {
      resolve({ exitCode: 1, durationMs: Date.now() - startedAtMs });
    });

    child.on('exit', (code) => {
      resolve({
        exitCode: code === null ? 1 : code,
        durationMs: Date.now() - startedAtMs,
      });
    });
  });
}

async function runPreflightChecks(): Promise<DrillStep[]> {
  const steps: DrillStep[] = [];

  const requiredFiles = ['Dockerfile', 'docker-compose.yml', 'src/index.ts'];
  const missing = requiredFiles.filter((relativePath) => !fs.existsSync(path.resolve(REPO_ROOT, relativePath)));

  if (missing.length > 0) {
    steps.push({
      name: 'preflight:required-files',
      status: 'fail',
      durationMs: 0,
      details: `Missing required files: ${missing.join(', ')}`,
    });
    return steps;
  }

  steps.push({
    name: 'preflight:required-files',
    status: 'pass',
    durationMs: 0,
    details: 'Required deployment files are present',
  });

  const checks = ['pnpm run type-check', 'pnpm run build'];

  for (const command of checks) {
    const { exitCode, durationMs } = await runCommand(command);
    steps.push({
      name: `preflight:${command}`,
      status: exitCode === 0 ? 'pass' : 'fail',
      durationMs,
      details: exitCode === 0 ? 'Command succeeded' : `Command failed with exit code ${exitCode}`,
    });

    if (exitCode !== 0) {
      break;
    }
  }

  return steps;
}

function deployRelease(previousRelease: ReleaseState, now: Date): { deployedRelease: ReleaseState; step: DrillStep } {
  const deployedRelease: ReleaseState = {
    releaseId: `deploy-${utcTimestampCompact(now)}`,
    promotedAt: now.toISOString(),
    source: `AUTO-03 from ${previousRelease.releaseId}`,
  };

  const startedAt = Date.now();
  writeJsonFile(ACTIVE_RELEASE_PATH, deployedRelease);
  const durationMs = Date.now() - startedAt;

  const active = readJsonFile<ReleaseState>(ACTIVE_RELEASE_PATH);
  if (active.releaseId !== deployedRelease.releaseId) {
    return {
      deployedRelease,
      step: {
        name: 'deploy:promote-release',
        status: 'fail',
        durationMs,
        details: 'Active release verification failed after deploy',
      },
    };
  }

  return {
    deployedRelease,
    step: {
      name: 'deploy:promote-release',
      status: 'pass',
      durationMs,
      details: `Promoted release ${deployedRelease.releaseId}`,
    },
  };
}

function rollbackRelease(previousRelease: ReleaseState): { finalRelease: ReleaseState; step: DrillStep } {
  const startedAt = Date.now();
  writeJsonFile(ACTIVE_RELEASE_PATH, previousRelease);
  const durationMs = Date.now() - startedAt;

  const active = readJsonFile<ReleaseState>(ACTIVE_RELEASE_PATH);
  if (active.releaseId !== previousRelease.releaseId) {
    return {
      finalRelease: active,
      step: {
        name: 'rollback:restore-previous-release',
        status: 'fail',
        durationMs,
        details: `Expected ${previousRelease.releaseId} but found ${active.releaseId}`,
      },
    };
  }

  return {
    finalRelease: active,
    step: {
      name: 'rollback:restore-previous-release',
      status: 'pass',
      durationMs,
      details: `Restored ${previousRelease.releaseId}`,
    },
  };
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const now = new Date();
  const timestamp = utcTimestampCompact(now);
  const reportPath = path.resolve(args.reportDir ?? ARTIFACT_DIR, `auto-03-deploy-rollback-drill-${timestamp}.json`);

  ensureDirectory(RELEASE_DIR);
  ensureDirectory(path.dirname(reportPath));

  const previousRelease = getOrCreatePreviousRelease(now);
  const steps: DrillStep[] = [];

  const preflightSteps = await runPreflightChecks();
  steps.push(...preflightSteps);

  const preflightFailed = preflightSteps.some((step) => step.status === 'fail');
  let deployedRelease = previousRelease;
  let finalRelease = previousRelease;

  if (!preflightFailed) {
    const deployResult = deployRelease(previousRelease, new Date());
    deployedRelease = deployResult.deployedRelease;
    steps.push(deployResult.step);

    if (deployResult.step.status === 'pass') {
      const rollbackResult = rollbackRelease(previousRelease);
      finalRelease = rollbackResult.finalRelease;
      steps.push(rollbackResult.step);
    }
  }

  const status: StepStatus = steps.every((step) => step.status === 'pass') ? 'pass' : 'fail';

  const artifact: DrillArtifact = {
    schemaVersion: 1,
    pipeline: 'AUTO-03',
    status,
    generatedAt: new Date().toISOString(),
    reportPath,
    releaseStatePath: ACTIVE_RELEASE_PATH,
    previousRelease,
    deployedRelease,
    finalRelease,
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

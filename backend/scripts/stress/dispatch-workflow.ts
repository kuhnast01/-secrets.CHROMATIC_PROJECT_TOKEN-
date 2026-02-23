export {};

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

type DispatchCliOptions = {
  help: boolean;
  workflow: string;
  ref: string;
  repo?: string;
  inputs: Record<string, string>;
  json: boolean;
  outputPath?: string;
};

type DispatchJsonResult = {
  schemaVersion: number;
  ok: boolean;
  mode: 'dispatch' | 'error';
  profile: string | null;
  repository: string | null;
  branch: string | null;
  runId: number | null;
  runNumber: number | null;
  runUrl: string | null;
  reportPassed: boolean;
  warningCount: number;
  warningThreshold: number | null;
  shouldOpenIssue: boolean;
  shouldCloseIssue: boolean;
  baselineComparable: boolean;
  failOnWarning: boolean;
  metadataPath: string | null;
  summaryPath: string | null;
  reportPath: string | null;
  workflow?: string;
  ref?: string;
  dispatched?: boolean;
  outputPath?: string;
  message?: string;
  exitCode?: number;
  errorType?: 'usage' | 'auth' | 'api' | 'unknown';
};

const CURRENT_SCHEMA_VERSION = 1;

class DispatchError extends Error {
  constructor(
    message: string,
    public readonly exitCode: number
  ) {
    super(message);
  }
}

function usageError(message: string): DispatchError {
  return new DispatchError(message, 2);
}

function authError(message: string): DispatchError {
  return new DispatchError(message, 3);
}

function apiError(message: string): DispatchError {
  return new DispatchError(message, 4);
}

function parseOptions(argv: string[]): DispatchCliOptions {
  if (argv.includes('--help') || argv.includes('-h')) {
    return {
      help: true,
      workflow: '',
      ref: 'main',
      inputs: {},
      json: false,
      outputPath: undefined,
    };
  }

  const args = [...argv];
  const workflow = args.shift();

  if (!workflow || workflow.startsWith('--')) {
    throw usageError('Missing workflow file/id argument (example: backend-weekly-reliability.yml).');
  }

  let ref = 'main';
  let repo: string | undefined;
  let inputs: Record<string, string> = {};
  let json = false;
  let outputPath: string | undefined;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === '--ref') {
      const value = args[index + 1];
      if (!value || value.startsWith('--')) throw usageError('Missing value for --ref.');
      ref = value;
      index += 1;
      continue;
    }

    if (arg === '--repo') {
      const value = args[index + 1];
      if (!value || value.startsWith('--')) throw usageError('Missing value for --repo (owner/repo).');
      repo = value;
      index += 1;
      continue;
    }

    if (arg === '--inputs') {
      const value = args[index + 1];
      if (!value || value.startsWith('--')) throw usageError('Missing JSON value for --inputs.');
      try {
        const parsed = JSON.parse(value) as Record<string, unknown>;
        inputs = Object.fromEntries(
          Object.entries(parsed).map(([key, v]) => [key, String(v)])
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw usageError(`Invalid JSON for --inputs: ${message}`);
      }
      index += 1;
      continue;
    }

    if (arg === '--json') {
      json = true;
      continue;
    }

    if (arg === '--output') {
      const value = args[index + 1];
      if (!value || value.startsWith('--')) throw usageError('Missing value for --output.');
      outputPath = value;
      index += 1;
      continue;
    }

    if (arg === '--help' || arg === '-h') {
      printUsage();
      process.exit(0);
    }

    throw usageError(`Unknown option: ${arg}`);
  }

  return { help: false, workflow, ref, repo, inputs, json, outputPath };
}

function printUsage(): void {
  console.log('Usage: pnpm exec tsx scripts/stress/dispatch-workflow.ts <workflow> [--ref <branch>] [--repo <owner/repo>] [--inputs <json>] [--output <path>] [--json]');
  console.log('');
  console.log('Examples:');
  console.log('  pnpm exec tsx scripts/stress/dispatch-workflow.ts backend-label-bootstrap.yml --ref main --inputs "{\"mode\":\"dry-run\"}"');
  console.log('  pnpm exec tsx scripts/stress/dispatch-workflow.ts backend-weekly-reliability.yml --ref main --inputs "{\"failOnWarn\":\"true\"}"');
  console.log('');
  console.log('Environment:');
  console.log('  GITHUB_TOKEN or GH_TOKEN (required)');
  console.log('  GITHUB_REPOSITORY=owner/repo (optional, unless --repo passed)');
}

function buildCanonicalDefaults(): Omit<DispatchJsonResult, 'schemaVersion' | 'ok' | 'mode'> {
  return {
    profile: null,
    repository: null,
    branch: null,
    runId: null,
    runNumber: null,
    runUrl: null,
    reportPassed: false,
    warningCount: 0,
    warningThreshold: null,
    shouldOpenIssue: false,
    shouldCloseIssue: false,
    baselineComparable: false,
    failOnWarning: false,
    metadataPath: null,
    summaryPath: null,
    reportPath: null,
  };
}

function emitJson(result: DispatchJsonResult): void {
  console.log(JSON.stringify(result, null, 2));
}

function writePrimaryOutput(path: string, payload: DispatchJsonResult): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(payload, null, 2)}\n`);
}

function getToken(): string {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (!token) {
    throw authError('Missing token. Set GITHUB_TOKEN (or GH_TOKEN).');
  }
  return token;
}

function getRepository(explicitRepo?: string): { owner: string; repo: string } {
  const source = explicitRepo || process.env.GITHUB_REPOSITORY;
  if (!source || !source.includes('/')) {
    throw usageError('Repository not provided. Pass --repo owner/repo or set GITHUB_REPOSITORY.');
  }

  const [owner, repo] = source.split('/', 2);
  if (!owner || !repo) {
    throw usageError(`Invalid repository value: ${source}`);
  }

  return { owner, repo };
}

async function githubPost(token: string, path: string, body: unknown): Promise<void> {
  let response: Response;
  try {
    response = await fetch(`https://api.github.com${path}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'User-Agent': 'backend-workflow-dispatch-helper',
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw apiError(`GitHub API request failed: ${message}`);
  }

  if (!response.ok) {
    const text = await response.text();
    if (response.status === 401 || response.status === 403) {
      throw authError(`GitHub API authentication failed (${response.status}): ${text}`);
    }
    throw apiError(`GitHub API dispatch failed (${response.status}): ${text}`);
  }
}

async function main(): Promise<void> {
  const options = parseOptions(process.argv.slice(2));
  if (options.help) {
    printUsage();
    return;
  }
  const token = getToken();
  const { owner, repo } = getRepository(options.repo);

  const payload = {
    ref: options.ref,
    inputs: options.inputs,
  };

  await githubPost(token, `/repos/${owner}/${repo}/actions/workflows/${options.workflow}/dispatches`, payload);

  const result: DispatchJsonResult = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    ok: true,
    mode: 'dispatch',
    ...buildCanonicalDefaults(),
    repository: `${owner}/${repo}`,
    branch: options.ref,
    workflow: options.workflow,
    ref: options.ref,
    dispatched: true,
    outputPath: options.outputPath,
    message: `Dispatched workflow '${options.workflow}' for ${owner}/${repo} on ref '${options.ref}'.`,
    exitCode: 0,
  };

  if (options.outputPath) {
    writePrimaryOutput(options.outputPath, result);
  }

  if (options.json) {
    emitJson(result);
  } else {
    console.log(
      `Dispatched workflow '${options.workflow}' for ${owner}/${repo} on ref '${options.ref}' with inputs: ${JSON.stringify(
        options.inputs
      )}`
    );
  }
}

main().catch((error) => {
  const outputIndex = process.argv.indexOf('--output');
  const outputPath =
    outputIndex >= 0 && process.argv[outputIndex + 1] && !process.argv[outputIndex + 1].startsWith('--')
      ? process.argv[outputIndex + 1]
      : undefined;
  const wantsJson = process.argv.includes('--json');
  const message = error instanceof Error ? error.message : String(error);
  const exitCode = error instanceof DispatchError ? error.exitCode : 1;
  const errorType: DispatchJsonResult['errorType'] =
    error instanceof DispatchError
      ? exitCode === 2
        ? 'usage'
        : exitCode === 3
          ? 'auth'
          : exitCode === 4
            ? 'api'
            : 'unknown'
      : 'unknown';

  const payload: DispatchJsonResult = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    ok: false,
    mode: 'error',
    ...buildCanonicalDefaults(),
    outputPath,
    message,
    exitCode,
    errorType,
  };

  if (outputPath) {
    writePrimaryOutput(outputPath, payload);
  }

  if (wantsJson) {
    emitJson(payload);
  } else {
    console.error(message);
  }

  process.exit(exitCode);
});

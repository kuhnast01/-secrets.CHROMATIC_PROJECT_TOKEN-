import { existsSync, readFileSync } from 'node:fs';

type CanonicalResult = {
  schemaVersion: number;
  ok: boolean;
  mode: string;
  profile: string | null;
  repository: string | null;
  branch: string | null;
  runId: string | number | null;
  runNumber: string | number | null;
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
};

const CURRENT_SCHEMA_VERSION = 1;
const ALLOWED_MODES = ['weekly-reliability', 'nightly-stress-smoke', 'poll', 'dispatch', 'error'] as const;

class ValidationError extends Error {
  constructor(message: string, public readonly exitCode: number) {
    super(message);
  }
}

function usage(message: string): never {
  throw new ValidationError(message, 2);
}

function assertType(condition: boolean, message: string): void {
  if (!condition) {
    throw new ValidationError(message, 1);
  }
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

function assertNullableStringField(payload: Record<string, unknown>, key: keyof CanonicalResult): void {
  const value = payload[key];
  assertType(value === null || typeof value === 'string', `Expected ${String(key)} to be null or a string.`);
}

function assertNullableRunField(payload: Record<string, unknown>, key: 'runId' | 'runNumber'): void {
  const value = payload[key];
  assertType(value === null || typeof value === 'string' || typeof value === 'number', `Expected ${key} to be null, string, or number.`);
}

function assertRequiredString(value: unknown, fieldName: string): void {
  assertType(isNonEmptyString(value), `Expected non-empty string field: ${fieldName}`);
}

function parseOptions(argv: string[]): { path: string; json: boolean } {
  if (argv.includes('--help') || argv.includes('-h')) {
    return { path: '', json: false };
  }

  let path = '';
  let json = false;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--path') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) usage('Missing value for --path.');
      path = value;
      index += 1;
      continue;
    }

    if (arg === '--json') {
      json = true;
      continue;
    }

    usage(`Unknown option: ${arg}`);
  }

  if (!path) {
    usage('Missing required --path argument.');
  }

  return { path, json };
}

function printUsage(): void {
  console.log('Usage: pnpm exec tsx scripts/stress/validate-canonical-result.ts --path <json-file> [--json]');
}

function loadJson(path: string): unknown {
  if (!existsSync(path)) {
    throw new ValidationError(`Canonical result file not found: ${path}`, 1);
  }

  try {
    return JSON.parse(readFileSync(path, 'utf8')) as unknown;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new ValidationError(`Canonical result file is not valid JSON: ${message}`, 1);
  }
}

function validateShape(value: unknown): CanonicalResult {
  assertType(typeof value === 'object' && value !== null && !Array.isArray(value), 'Payload must be a JSON object.');
  const payload = value as Record<string, unknown>;

  assertType(
    typeof payload.schemaVersion === 'number' && Number.isInteger(payload.schemaVersion),
    'Expected integer field: schemaVersion'
  );
  assertType(payload.schemaVersion === CURRENT_SCHEMA_VERSION, `Unsupported schemaVersion: ${String(payload.schemaVersion)} (expected ${CURRENT_SCHEMA_VERSION}).`);

  const requiredBoolean: Array<keyof CanonicalResult> = [
    'ok',
    'reportPassed',
    'shouldOpenIssue',
    'shouldCloseIssue',
    'baselineComparable',
    'failOnWarning',
  ];

  const requiredString: Array<keyof CanonicalResult> = [
    'mode',
  ];

  for (const key of requiredBoolean) {
    assertType(typeof payload[key] === 'boolean', `Expected boolean field: ${String(key)}`);
  }

  for (const key of requiredString) {
    assertType(typeof payload[key] === 'string' && String(payload[key]).length > 0, `Expected non-empty string field: ${String(key)}`);
  }

  assertType(ALLOWED_MODES.includes(payload.mode as (typeof ALLOWED_MODES)[number]), `Unsupported mode: ${String(payload.mode)}.`);

  assertNullableStringField(payload, 'profile');
  assertNullableStringField(payload, 'repository');
  assertNullableStringField(payload, 'branch');
  assertNullableStringField(payload, 'runUrl');
  assertNullableStringField(payload, 'metadataPath');
  assertNullableStringField(payload, 'summaryPath');
  assertNullableStringField(payload, 'reportPath');

  assertNullableRunField(payload, 'runId');
  assertNullableRunField(payload, 'runNumber');

  assertType(typeof payload.warningCount === 'number' && Number.isFinite(payload.warningCount), 'Expected warningCount to be a number.');
  assertType(
    payload.warningThreshold === null || (typeof payload.warningThreshold === 'number' && Number.isFinite(payload.warningThreshold)),
    'Expected warningThreshold to be null or a number.'
  );

  const mode = payload.mode as (typeof ALLOWED_MODES)[number];

  if (mode === 'weekly-reliability' || mode === 'nightly-stress-smoke') {
    assertRequiredString(payload.repository, 'repository');
    assertRequiredString(payload.branch, 'branch');
    assertRequiredString(payload.runUrl, 'runUrl');
    assertRequiredString(payload.metadataPath, 'metadataPath');
    assertRequiredString(payload.summaryPath, 'summaryPath');
    assertRequiredString(payload.reportPath, 'reportPath');
    assertType(payload.runId !== null, 'Expected runId to be present for CI canonical payloads.');
    assertType(payload.runNumber !== null, 'Expected runNumber to be present for CI canonical payloads.');
  }

  if (mode === 'poll') {
    assertRequiredString(payload.repository, 'repository');
    assertRequiredString(payload.branch, 'branch');
    assertRequiredString(payload.runUrl, 'runUrl');
    assertType(payload.runId !== null, 'Expected runId to be present for poll payloads.');
    assertType(payload.runNumber !== null, 'Expected runNumber to be present for poll payloads.');
  }

  if (mode === 'dispatch' && payload.ok) {
    assertRequiredString(payload.repository, 'repository');
    assertRequiredString(payload.branch, 'branch');
  }

  return payload as CanonicalResult;
}

function main(): void {
  const options = parseOptions(process.argv.slice(2));

  if (!options.path) {
    printUsage();
    process.exit(0);
  }

  const payload = validateShape(loadJson(options.path));

  if (options.json) {
    console.log(
      JSON.stringify(
        {
          ok: true,
          message: 'Canonical result schema validation passed.',
          path: options.path,
          schemaVersion: payload.schemaVersion,
          mode: payload.mode,
          profile: payload.profile,
        },
        null,
        2
      )
    );
  } else {
    console.log(`Canonical result schema validation passed: ${options.path}`);
  }
}

try {
  main();
} catch (error) {
  if (error instanceof ValidationError) {
    console.error(error.message);
    process.exit(error.exitCode);
  }

  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
}

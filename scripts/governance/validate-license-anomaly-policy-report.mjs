import console from 'node:console';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

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

function fail(message) {
  console.error(JSON.stringify({ ok: false, error: message }, null, 2));
  process.exit(1);
}

function isString(value) {
  return typeof value === 'string' && value.length > 0;
}

function isNullableString(value) {
  return value === null || typeof value === 'string';
}

function isNullableInteger(value) {
  return value === null || Number.isInteger(value);
}

function validate(report) {
  if (!report || typeof report !== 'object') {
    fail('report must be an object');
  }

  if (report.schemaVersion !== 1) {
    fail('schemaVersion must be 1');
  }

  if (report.checkId !== 'LIC-ANOMALY-POLICY') {
    fail('checkId must be LIC-ANOMALY-POLICY');
  }

  if (report.status !== 'pass' && report.status !== 'fail') {
    fail('status must be pass or fail');
  }

  if (!isString(report.generatedAt)) {
    fail('generatedAt must be a non-empty string');
  }

  if (!isString(report.policyPath)) {
    fail('policyPath must be a non-empty string');
  }
  if (!isString(report.workflowPath)) {
    fail('workflowPath must be a non-empty string');
  }
  if (!isString(report.docsPath)) {
    fail('docsPath must be a non-empty string');
  }

  if (!isNullableString(report.policyId)) {
    fail('policyId must be string or null');
  }

  if (!isNullableInteger(report.policySchemaVersion)) {
    fail('policySchemaVersion must be integer or null');
  }

  if (!Number.isInteger(report.failureCount) || report.failureCount < 0) {
    fail('failureCount must be an integer >= 0');
  }

  if (!Array.isArray(report.failures)) {
    fail('failures must be an array');
  }

  for (const failure of report.failures) {
    if (!isString(failure)) {
      fail('each failure entry must be a non-empty string');
    }
  }

  if (report.failureCount !== report.failures.length) {
    fail('failureCount must equal failures.length');
  }

  if (report.status === 'pass' && report.failureCount !== 0) {
    fail('status pass requires failureCount to be 0');
  }

  if (report.status === 'fail' && report.failureCount === 0) {
    fail('status fail requires failureCount greater than 0');
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const reportPath = path.resolve(args.path ?? 'governance-artifacts/license-anomaly-escalation-policy-report.json');

  if (!fs.existsSync(reportPath)) {
    fail(`report file not found: ${reportPath}`);
  }

  let report;
  try {
    report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'invalid_json';
    fail(`unable to parse report JSON: ${message}`);
  }

  validate(report);

  const output = {
    ok: true,
    schemaVersion: 1,
    path: path.relative(process.cwd(), reportPath).replace(/\\/g, '/'),
    checkId: report.checkId,
    status: report.status,
    failureCount: report.failureCount,
  };

  console.log(JSON.stringify(output, null, 2));
}

main();

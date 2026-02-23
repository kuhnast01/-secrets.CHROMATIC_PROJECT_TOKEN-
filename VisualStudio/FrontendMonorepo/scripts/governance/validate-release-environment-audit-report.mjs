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

function validate(report) {
  if (!report || typeof report !== 'object') {
    fail('report must be an object');
  }

  if (report.schemaVersion !== 1) {
    fail('schemaVersion must be 1');
  }

  const mode = report.mode;
  if (mode !== 'release-environment-audit-monthly') {
    fail('mode must be release-environment-audit-monthly');
  }

  if (!isString(report.repository)) {
    fail('repository must be a non-empty string');
  }
  if (!isString(report.branch)) {
    fail('branch must be a non-empty string');
  }
  if (!isString(report.runId)) {
    fail('runId must be a non-empty string');
  }
  if (!isString(report.runNumber)) {
    fail('runNumber must be a non-empty string');
  }
  if (!isString(report.runUrl)) {
    fail('runUrl must be a non-empty string');
  }
  if (!isString(report.targetEnvironment)) {
    fail('targetEnvironment must be a non-empty string');
  }

  const auditStatus = report.auditStatus;
  if (auditStatus !== 'PASS' && auditStatus !== 'DRIFT_DETECTED' && auditStatus !== 'unknown') {
    fail('auditStatus must be PASS, DRIFT_DETECTED, or unknown');
  }

  if (!isNullableString(report.issueNumber)) {
    fail('issueNumber must be string or null');
  }
  if (!isNullableString(report.operation)) {
    fail('operation must be string or null');
  }
  if (!isNullableString(report.secretCheckNote)) {
    fail('secretCheckNote must be string or null');
  }

  if (!Array.isArray(report.findings)) {
    fail('findings must be an array');
  }
  for (const finding of report.findings) {
    if (!isString(finding)) {
      fail('every findings item must be a non-empty string');
    }
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const reportPath = path.resolve(args.path ?? 'governance-artifacts/release-environment-audit-report.json');

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
    auditStatus: report.auditStatus,
    findingCount: report.findings.length,
  };
  console.log(JSON.stringify(output, null, 2));
}

main();

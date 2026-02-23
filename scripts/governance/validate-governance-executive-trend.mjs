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

function validateCurrent(current) {
  if (!current || typeof current !== 'object') {
    fail('current must be an object');
  }
  if (!isString(current.snapshotPath)) {
    fail('current.snapshotPath must be a non-empty string');
  }
  if (!isNullableString(current.generatedAt)) {
    fail('current.generatedAt must be string or null');
  }
  if (!isString(current.overallStatus)) {
    fail('current.overallStatus must be a non-empty string');
  }
  if (!Number.isInteger(current.attentionCount) || current.attentionCount < 0) {
    fail('current.attentionCount must be an integer >= 0');
  }
  if (!Number.isInteger(current.missingCount) || current.missingCount < 0) {
    fail('current.missingCount must be an integer >= 0');
  }
  if (!Number.isInteger(current.riskCount) || current.riskCount < 0) {
    fail('current.riskCount must be an integer >= 0');
  }
  if (current.riskCount !== current.attentionCount + current.missingCount) {
    fail('current.riskCount must equal current.attentionCount + current.missingCount');
  }
  if (!isNullableInteger(current.controlCount)) {
    fail('current.controlCount must be integer or null');
  }
}

function validatePrevious(previous) {
  if (!previous || typeof previous !== 'object') {
    fail('previous must be an object');
  }

  if (!isString(previous.snapshotPath)) {
    fail('previous.snapshotPath must be a non-empty string');
  }

  if (typeof previous.present !== 'boolean') {
    fail('previous.present must be a boolean');
  }

  if (!isNullableString(previous.generatedAt)) {
    fail('previous.generatedAt must be string or null');
  }

  if (!isNullableString(previous.overallStatus)) {
    fail('previous.overallStatus must be string or null');
  }

  if (!isNullableInteger(previous.attentionCount)) {
    fail('previous.attentionCount must be integer or null');
  }
  if (!isNullableInteger(previous.missingCount)) {
    fail('previous.missingCount must be integer or null');
  }
  if (!isNullableInteger(previous.riskCount)) {
    fail('previous.riskCount must be integer or null');
  }
  if (!isNullableInteger(previous.controlCount)) {
    fail('previous.controlCount must be integer or null');
  }

  if (!isNullableString(previous.runId)) {
    fail('previous.runId must be string or null');
  }
  if (!isNullableString(previous.runNumber)) {
    fail('previous.runNumber must be string or null');
  }
  if (!isNullableString(previous.runUrl)) {
    fail('previous.runUrl must be string or null');
  }

  if (previous.present) {
    if (!isString(previous.overallStatus)) {
      fail('previous.overallStatus must be non-empty string when previous.present is true');
    }
    if (!Number.isInteger(previous.attentionCount) || previous.attentionCount < 0) {
      fail('previous.attentionCount must be integer >= 0 when previous.present is true');
    }
    if (!Number.isInteger(previous.missingCount) || previous.missingCount < 0) {
      fail('previous.missingCount must be integer >= 0 when previous.present is true');
    }
    if (!Number.isInteger(previous.riskCount) || previous.riskCount < 0) {
      fail('previous.riskCount must be integer >= 0 when previous.present is true');
    }
    if (previous.riskCount !== previous.attentionCount + previous.missingCount) {
      fail('previous.riskCount must equal previous.attentionCount + previous.missingCount');
    }
  }
}

function validateDelta(delta, hasPrevious) {
  if (!delta || typeof delta !== 'object') {
    fail('delta must be an object');
  }

  if (delta.overallStatusChanged !== null && typeof delta.overallStatusChanged !== 'boolean') {
    fail('delta.overallStatusChanged must be boolean or null');
  }

  const integerOrNull = ['attentionCountDelta', 'missingCountDelta', 'riskCountDelta', 'controlCountDelta'];
  for (const key of integerOrNull) {
    if (!isNullableInteger(delta[key])) {
      fail(`delta.${key} must be integer or null`);
    }
  }

  if (hasPrevious) {
    if (delta.overallStatusChanged === null) {
      fail('delta.overallStatusChanged must not be null when previous.present is true');
    }
    for (const key of integerOrNull) {
      if (delta[key] === null) {
        fail(`delta.${key} must not be null when previous.present is true`);
      }
    }
  }
}

function validate(trend) {
  if (!trend || typeof trend !== 'object') {
    fail('trend report must be an object');
  }

  if (trend.schemaVersion !== 1) {
    fail('schemaVersion must be 1');
  }

  if (trend.mode !== 'governance-executive-trend-monthly') {
    fail('mode must be governance-executive-trend-monthly');
  }

  if (!isString(trend.generatedAt)) {
    fail('generatedAt must be a non-empty string');
  }

  if (!isString(trend.repository)) {
    fail('repository must be a non-empty string');
  }

  if (!isString(trend.branch)) {
    fail('branch must be a non-empty string');
  }

  if (!isString(trend.runId)) {
    fail('runId must be a non-empty string');
  }

  if (!isString(trend.runNumber)) {
    fail('runNumber must be a non-empty string');
  }

  if (!isNullableString(trend.runUrl)) {
    fail('runUrl must be string or null');
  }

  validateCurrent(trend.current);
  validatePrevious(trend.previous);
  validateDelta(trend.delta, trend.previous.present === true);

  const allowedTrendDirections = new Set(['baseline', 'improving', 'stable', 'regressing']);
  if (!allowedTrendDirections.has(trend.trendDirection)) {
    fail('trendDirection must be one of baseline, improving, stable, regressing');
  }

  if (trend.previous.present !== true && trend.trendDirection !== 'baseline') {
    fail('trendDirection must be baseline when previous.present is false');
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const reportPath = path.resolve(args.path ?? 'governance-artifacts/governance-executive-trend.json');

  if (!fs.existsSync(reportPath)) {
    fail(`trend report file not found: ${reportPath}`);
  }

  let report;
  try {
    report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'invalid_json';
    fail(`unable to parse trend report JSON: ${message}`);
  }

  validate(report);

  const output = {
    ok: true,
    schemaVersion: 1,
    path: path.relative(process.cwd(), reportPath).replace(/\\/g, '/'),
    trendDirection: report.trendDirection,
    hasPreviousBaseline: report.previous.present === true,
    currentStatus: report.current.overallStatus,
    previousStatus: report.previous.overallStatus,
  };

  console.log(JSON.stringify(output, null, 2));
}

main();

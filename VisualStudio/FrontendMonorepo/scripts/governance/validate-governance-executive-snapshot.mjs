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

function validateControl(control) {
  if (!control || typeof control !== 'object') {
    fail('each control must be an object');
  }

  if (!isString(control.id)) {
    fail('control.id must be a non-empty string');
  }

  if (!isString(control.sourcePath)) {
    fail('control.sourcePath must be a non-empty string');
  }

  if (typeof control.present !== 'boolean') {
    fail('control.present must be a boolean');
  }

  const allowedStatuses = new Set(['pass', 'fail', 'missing', 'invalid', 'unknown']);
  if (!allowedStatuses.has(control.status)) {
    fail('control.status must be one of pass, fail, missing, invalid, unknown');
  }

  if (!isNullableString(control.generatedAt)) {
    fail('control.generatedAt must be string or null');
  }

  if (!control.details || typeof control.details !== 'object') {
    fail('control.details must be an object');
  }

  if (!control.present && control.status !== 'missing') {
    fail('control.present=false requires status=missing');
  }

  if (control.status === 'missing' && control.present !== false) {
    fail('control.status=missing requires present=false');
  }
}

function validate(snapshot) {
  if (!snapshot || typeof snapshot !== 'object') {
    fail('snapshot must be an object');
  }

  if (snapshot.schemaVersion !== 1) {
    fail('schemaVersion must be 1');
  }

  if (snapshot.mode !== 'governance-executive-snapshot-monthly') {
    fail('mode must be governance-executive-snapshot-monthly');
  }

  if (!isString(snapshot.generatedAt)) {
    fail('generatedAt must be a non-empty string');
  }

  if (!isString(snapshot.repository)) {
    fail('repository must be a non-empty string');
  }

  if (!isString(snapshot.branch)) {
    fail('branch must be a non-empty string');
  }

  if (!isString(snapshot.runId)) {
    fail('runId must be a non-empty string');
  }

  if (!isString(snapshot.runNumber)) {
    fail('runNumber must be a non-empty string');
  }

  if (!isNullableString(snapshot.runUrl)) {
    fail('runUrl must be a string or null');
  }

  if (!isString(snapshot.eventName)) {
    fail('eventName must be a non-empty string');
  }

  if (!snapshot.sourceWorkflow || typeof snapshot.sourceWorkflow !== 'object') {
    fail('sourceWorkflow must be an object');
  }

  if (!isString(snapshot.sourceWorkflow.trigger)) {
    fail('sourceWorkflow.trigger must be a non-empty string');
  }

  if (!isNullableString(snapshot.sourceWorkflow.workflowName)) {
    fail('sourceWorkflow.workflowName must be a string or null');
  }

  if (!isNullableString(snapshot.sourceWorkflow.workflowRunId)) {
    fail('sourceWorkflow.workflowRunId must be a string or null');
  }

  if (!isNullableString(snapshot.sourceWorkflow.workflowConclusion)) {
    fail('sourceWorkflow.workflowConclusion must be a string or null');
  }

  if (!Number.isInteger(snapshot.controlCount) || snapshot.controlCount < 1) {
    fail('controlCount must be an integer >= 1');
  }

  if (!Array.isArray(snapshot.controls) || snapshot.controls.length === 0) {
    fail('controls must be a non-empty array');
  }

  for (const control of snapshot.controls) {
    validateControl(control);
  }

  if (snapshot.controlCount !== snapshot.controls.length) {
    fail('controlCount must equal controls.length');
  }

  const allowedOverallStatus = new Set(['ok', 'partial', 'attention']);
  if (!allowedOverallStatus.has(snapshot.overallStatus)) {
    fail('overallStatus must be one of ok, partial, attention');
  }

  if (!Array.isArray(snapshot.attentionControls)) {
    fail('attentionControls must be an array');
  }
  if (!Array.isArray(snapshot.missingControls)) {
    fail('missingControls must be an array');
  }

  for (const item of snapshot.attentionControls) {
    if (!isString(item)) {
      fail('attentionControls entries must be non-empty strings');
    }
  }
  for (const item of snapshot.missingControls) {
    if (!isString(item)) {
      fail('missingControls entries must be non-empty strings');
    }
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const snapshotPath = path.resolve(args.path ?? 'governance-artifacts/governance-executive-snapshot.json');

  if (!fs.existsSync(snapshotPath)) {
    fail(`snapshot file not found: ${snapshotPath}`);
  }

  let snapshot;
  try {
    snapshot = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'invalid_json';
    fail(`unable to parse snapshot JSON: ${message}`);
  }

  validate(snapshot);

  const output = {
    ok: true,
    schemaVersion: 1,
    path: path.relative(process.cwd(), snapshotPath).replace(/\\/g, '/'),
    overallStatus: snapshot.overallStatus,
    controlCount: snapshot.controlCount,
    attentionCount: snapshot.attentionControls.length,
    missingCount: snapshot.missingControls.length,
  };

  console.log(JSON.stringify(output, null, 2));
}

main();

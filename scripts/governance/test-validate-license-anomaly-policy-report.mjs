import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const repoRoot = globalThis.process.cwd();
const validatorPath = path.join(repoRoot, 'scripts', 'governance', 'validate-license-anomaly-policy-report.mjs');
const validFixture = path.join(repoRoot, 'scripts', 'governance', 'fixtures', 'license-anomaly-policy-report.valid.json');
const invalidFixture = path.join(repoRoot, 'scripts', 'governance', 'fixtures', 'license-anomaly-policy-report.invalid.json');

function runValidator(fixturePath) {
  return spawnSync(globalThis.process.execPath, [validatorPath, `--path=${fixturePath}`], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
}

function expectPass() {
  const result = runValidator(validFixture);
  assert.equal(result.status, 0, `Expected valid fixture to pass. stderr: ${result.stderr}`);
  const output = JSON.parse(result.stdout);
  assert.equal(output.ok, true);
  assert.equal(output.status, 'pass');
  assert.equal(output.failureCount, 0);
}

function expectFail() {
  const result = runValidator(invalidFixture);
  assert.notEqual(result.status, 0, 'Expected invalid fixture to fail validation.');
  const output = JSON.parse(result.stderr);
  assert.equal(output.ok, false);
  assert.match(String(output.error), /status pass requires failureCount to be 0/i);
}

expectPass();
expectFail();

globalThis.console.log('License anomaly policy report validator regression tests passed.');

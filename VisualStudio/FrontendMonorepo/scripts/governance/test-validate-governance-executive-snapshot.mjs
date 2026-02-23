import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const repoRoot = globalThis.process.cwd();
const validatorPath = path.join(repoRoot, 'scripts', 'governance', 'validate-governance-executive-snapshot.mjs');
const validFixture = path.join(repoRoot, 'scripts', 'governance', 'fixtures', 'governance-executive-snapshot.valid.json');
const invalidFixture = path.join(repoRoot, 'scripts', 'governance', 'fixtures', 'governance-executive-snapshot.invalid.json');

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
  assert.equal(output.overallStatus, 'ok');
  assert.equal(output.controlCount, 2);
}

function expectFail() {
  const result = runValidator(invalidFixture);
  assert.notEqual(result.status, 0, 'Expected invalid fixture to fail validation.');
  const output = JSON.parse(result.stderr);
  assert.equal(output.ok, false);
  assert.match(String(output.error), /present=false requires status=missing/i);
}

expectPass();
expectFail();

globalThis.console.log('Governance executive snapshot validator regression tests passed.');

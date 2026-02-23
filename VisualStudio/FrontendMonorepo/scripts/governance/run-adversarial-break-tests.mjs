import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';

const repoRoot = globalThis.process.cwd();
const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), 'poseidon-governance-breaktest-'));

const filesToCopy = [
  'scripts/governance/check-branch-protection-audit-template.mjs',
  'scripts/governance/check-controls-matrix.mjs',
  '.github/workflows/backend-branch-protection-audit-monthly-issue.yml',
  'backend/DOCUMENTATION_RUNBOOKS.md',
  'backend/scripts/stress/bootstrap-github-labels.ts',
  'GOVERNANCE_CONTROLS_MATRIX.md',
  'scripts/legal/check-release-template-drift.mjs',
  'scripts/legal/release-record-schema.mjs',
  'legal/APPROVAL_RECORD_TEMPLATE.md',
  'legal/LEGAL_RELEASE_BUNDLE_CHECKLIST.md',
  'scripts/legal/fixtures/APPROVAL_RECORD_TEMPLATE_MISSING_FOUNDER.md',
];

for (const rel of filesToCopy) {
  const src = path.join(repoRoot, rel);
  const dst = path.join(sandbox, rel);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(src, dst);
}

function runNode(scriptRel, env = {}) {
  const result = spawnSync('node', [scriptRel], {
    cwd: sandbox,
    env: { ...globalThis.process.env, ...env },
    encoding: 'utf8',
  });

  return {
    exitCode: typeof result.status === 'number' ? result.status : 1,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
  };
}

function scenario(name, expectedFail, execute) {
  const outcome = execute();
  const caught = (expectedFail && outcome.exitCode !== 0) || (!expectedFail && outcome.exitCode === 0);
  return {
    scenario: name,
    expected: expectedFail ? 'FAIL' : 'PASS',
    exitCode: outcome.exitCode,
    caught: caught ? 'CAUGHT' : 'MISSED',
    stderr: outcome.stderr.trim(),
  };
}

const results = [];

// S1: remove governance-dry-run from monthly workflow
const workflowPath = path.join(sandbox, '.github/workflows/backend-branch-protection-audit-monthly-issue.yml');
fs.writeFileSync(
  workflowPath,
  fs.readFileSync(workflowPath, 'utf8').replace(/.*Governance Dry Run \/ governance-dry-run.*\r?\n/g, ''),
  'utf8'
);
results.push(
  scenario('S1 remove governance-dry-run check', true, () =>
    runNode('scripts/governance/check-branch-protection-audit-template.mjs')
  )
);

// restore
fs.copyFileSync(
  path.join(repoRoot, '.github/workflows/backend-branch-protection-audit-monthly-issue.yml'),
  workflowPath
);

// S2: remove KPI label default
const labelPath = path.join(sandbox, 'backend/scripts/stress/bootstrap-github-labels.ts');
fs.writeFileSync(
  labelPath,
  fs.readFileSync(labelPath, 'utf8').replace(/.*kpi:legal-drift-review.*\r?\n/g, ''),
  'utf8'
);
results.push(
  scenario('S2 remove KPI label default', true, () =>
    runNode('scripts/governance/check-branch-protection-audit-template.mjs')
  )
);

// restore
fs.copyFileSync(path.join(repoRoot, 'backend/scripts/stress/bootstrap-github-labels.ts'), labelPath);

// S3: blank controls matrix owner
const matrixPath = path.join(sandbox, 'GOVERNANCE_CONTROLS_MATRIX.md');
fs.writeFileSync(
  matrixPath,
  fs
    .readFileSync(matrixPath, 'utf8')
    .replace('| Branch protection monthly verification | @kuhna |', '| Branch protection monthly verification |  |'),
  'utf8'
);
results.push(
  scenario('S3 blank matrix owner field', true, () =>
    runNode('scripts/governance/check-controls-matrix.mjs')
  )
);

// restore
fs.copyFileSync(path.join(repoRoot, 'GOVERNANCE_CONTROLS_MATRIX.md'), matrixPath);

// S4: legal drift baseline pass
results.push(
  scenario('S4 legal drift baseline', false, () =>
    runNode('scripts/legal/check-release-template-drift.mjs')
  )
);

// S5: legal negative fixture fails
results.push(
  scenario('S5 legal drift negative fixture', true, () =>
    runNode('scripts/legal/check-release-template-drift.mjs', {
      LEGAL_APPROVAL_TEMPLATE_PATH: 'scripts/legal/fixtures/APPROVAL_RECORD_TEMPLATE_MISSING_FOUNDER.md',
    })
  )
);

const report = {
  schemaVersion: 1,
  sandbox,
  total: results.length,
  caught: results.filter((r) => r.caught === 'CAUGHT').length,
  missed: results.filter((r) => r.caught === 'MISSED').length,
  results,
};

const reportPath = path.join(sandbox, 'break-test-report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');

globalThis.console.log(`Adversarial break-test report: ${reportPath}`);
for (const row of results) {
  globalThis.console.log(`[${row.caught}] ${row.scenario} expected=${row.expected} exit=${row.exitCode}`);
  if (row.stderr) {
    globalThis.console.log(`  stderr: ${row.stderr.split('\n')[0]}`);
  }
}

if (report.missed > 0) {
  globalThis.process.exit(1);
}

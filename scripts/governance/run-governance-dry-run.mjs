import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repoRoot = globalThis.process.cwd();
const artifactsDir = path.join(repoRoot, 'governance-artifacts');
const reportPath = path.join(artifactsDir, 'governance-dry-run-report.json');
const pnpmCmd = 'pnpm';

const checks = [
  {
    name: 'governance-adversarial-break-tests',
    command: 'node',
    args: ['scripts/governance/run-adversarial-break-tests.mjs'],
  },
  {
    name: 'governance-controls-matrix-schema',
    command: 'node',
    args: ['scripts/governance/check-controls-matrix.mjs'],
  },
  {
    name: 'branch-protection-drift',
    command: 'node',
    args: ['scripts/governance/check-branch-protection-audit-template.mjs'],
  },
  {
    name: 'legal-release-records',
    command: 'node',
    args: ['scripts/legal/check-release-records.mjs'],
  },
  {
    name: 'legal-template-drift',
    command: 'node',
    args: ['scripts/legal/check-release-template-drift.mjs'],
  },
  {
    name: 'backend-markdown-links',
    command: pnpmCmd,
    args: ['--dir', 'backend', 'exec', 'tsx', 'scripts/docs/check-markdown-links.ts'],
  },
  {
    name: 'label-defaults-json',
    command: pnpmCmd,
    args: ['--dir', 'backend', 'exec', 'tsx', 'scripts/stress/bootstrap-github-labels.ts', '--list-defaults', '--json'],
  },
  {
    name: 'go-live-closeout-structure',
    command: 'node',
    args: ['scripts/governance/check-go-live-closeout.mjs'],
  },
  {
    name: 'mono-release-lanes',
    command: 'node',
    args: ['scripts/governance/check-mono-release-lanes.mjs', '--strict'],
  },
  {
    name: 'mono-supply-chain',
    command: 'node',
    args: ['scripts/governance/check-mono-supply-chain.mjs', '--strict'],
  },
];

function runCheck(check) {
  const startedAt = new Date().toISOString();
  const isWindows = globalThis.process.platform === 'win32';
  const result = isWindows && check.command === pnpmCmd
    ? spawnSync('cmd.exe', ['/d', '/s', '/c', `${check.command} ${check.args.join(' ')}`], {
        cwd: repoRoot,
        encoding: 'utf8',
        stdio: 'pipe',
      })
    : spawnSync(check.command, check.args, {
        cwd: repoRoot,
        encoding: 'utf8',
        stdio: 'pipe',
      });
  const endedAt = new Date().toISOString();
  const exitCode = typeof result.status === 'number' ? result.status : 1;

  return {
    name: check.name,
    command: [check.command, ...check.args].join(' '),
    startedAt,
    endedAt,
    exitCode,
    ok: exitCode === 0,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    error: result.error ? String(result.error.message || result.error) : '',
  };
}

const startedAt = new Date().toISOString();
const results = checks.map(runCheck);
const endedAt = new Date().toISOString();
const failedChecks = results.filter((entry) => !entry.ok).map((entry) => entry.name);

const report = {
  schemaVersion: 1,
  startedAt,
  endedAt,
  ok: failedChecks.length === 0,
  failedChecks,
  checks: results,
};

fs.mkdirSync(artifactsDir, { recursive: true });
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');

globalThis.console.log(`Governance dry-run report written: ${path.relative(repoRoot, reportPath)}`);

for (const item of results) {
  const marker = item.ok ? 'PASS' : 'FAIL';
  globalThis.console.log(`[${marker}] ${item.name} (exit=${item.exitCode})`);
}

if (!report.ok) {
  globalThis.process.exit(1);
}

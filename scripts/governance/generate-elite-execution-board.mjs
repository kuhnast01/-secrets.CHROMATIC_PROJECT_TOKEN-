import fs from 'node:fs';
import path from 'node:path';

const repoRoot = globalThis.process.cwd();
const matrixPath = path.join(repoRoot, 'POSEIDON_ELITE_TODO.md');
const boardPath = path.join(repoRoot, 'ELITE_EXECUTION_BOARD.md');

const sectionPattern = /^###\s+Pillar\s+(\d+)\s+—\s+(.+)$/gm;
const testPattern = /^- \[(x| )\]\s+`([A-Z-0-9]+)`\s+(.+)$/gim;

function fail(message) {
  globalThis.console.error(message);
  globalThis.process.exit(1);
}

function parseMatrix(content) {
  const start = content.indexOf('## Elite Validation Test Matrix (v1)');
  const end = content.indexOf('### Scorecard Rule', start);
  if (start < 0 || end < 0) {
    fail('Could not find Elite Validation Test Matrix section in POSEIDON_ELITE_TODO.md');
  }

  const body = content.slice(start, end);
  const sectionMatches = [...body.matchAll(sectionPattern)];
  if (sectionMatches.length !== 7) {
    fail(`Expected 7 pillar sections, found ${sectionMatches.length}.`);
  }

  return sectionMatches.map((match, index) => {
    const number = Number(match[1]);
    const name = match[2].trim();
    const blockStart = match.index ?? 0;
    const blockEnd = index + 1 < sectionMatches.length ? (sectionMatches[index + 1].index ?? body.length) : body.length;
    const block = body.slice(blockStart, blockEnd);

    const tests = [...block.matchAll(testPattern)].map((entry) => ({
      done: entry[1].toLowerCase() === 'x',
      id: entry[2],
      title: entry[3].trim(),
      pillar: number,
      pillarName: name,
    }));

    return {
      number,
      name,
      tests,
    };
  });
}

function statusBox(done) {
  return done ? '[x]' : '[ ]';
}

function renderTask(task) {
  return `- ${statusBox(task.done)} **${task.id}** — ${task.title} _(Pillar ${task.pillar}: ${task.pillarName})_`;
}

function buildBoard(pillars) {
  const all = pillars.flatMap((pillar) => pillar.tests);

  const baseline = all.filter((task) => task.id.endsWith('-01'));

  const launchCriticalPillars = new Set([2, 3, 5, 7]);
  const launchRemaining = all.filter(
    (task) => launchCriticalPillars.has(task.pillar) && !task.id.endsWith('-01'),
  );

  const strategic = all.filter(
    (task) => !task.id.endsWith('-01') && !launchCriticalPillars.has(task.pillar),
  );

  const completed = all.filter((task) => task.done).length;
  const completionPct = all.length === 0 ? 0 : ((completed / all.length) * 100).toFixed(2);

  const lines = [];
  lines.push('# Elite Execution Board');
  lines.push('');
  lines.push('Source: `POSEIDON_ELITE_TODO.md` -> `Elite Validation Test Matrix (v1)`');
  lines.push('');
  lines.push('## Snapshot');
  lines.push(`- Total tests: **${all.length}**`);
  lines.push(`- Completed: **${completed}**`);
  lines.push(`- Completion: **${completionPct}%**`);
  lines.push(`- Baseline tests (` + '`*-01`' + `): **${baseline.length}**`);
  lines.push('');
  lines.push('## Wave 0 — Baseline Unlock (Required for Elite)');
  lines.push('- Goal: pass all `*-01` tests across all 7 pillars.');
  for (const task of baseline) {
    lines.push(renderTask(task));
  }
  lines.push('');
  lines.push('## Wave 1 — Launch-Critical Completion (Pillars 2, 3, 5, 7)');
  lines.push('- Goal: reach 100% in Pillars 2, 3, 5, and 7 for launch-readiness gate.');
  for (const task of launchRemaining) {
    lines.push(renderTask(task));
  }
  lines.push('');
  lines.push('## Wave 2 — Strategic Differentiation (Pillars 1, 4, 6)');
  lines.push('- Goal: complete remaining strategic differentiation tasks after launch gates are stable.');
  for (const task of strategic) {
    lines.push(renderTask(task));
  }
  lines.push('');
  lines.push('## Execution Rules');
  lines.push('- Keep each task linked to evidence artifact(s): PR, workflow run, and report JSON where available.');
  lines.push('- Update checkbox state only when acceptance criteria are demonstrably met.');
  lines.push('- Re-run readiness gates after each merged task:');
  lines.push('  - `pnpm run governance:check-elite-readiness`');
  lines.push('  - `pnpm run governance:check-elite-readiness:strict`');
  lines.push('  - `pnpm run governance:check-launch-readiness:strict`');

  return `${lines.join('\n')}\n`;
}

function main() {
  if (!fs.existsSync(matrixPath)) {
    fail('Missing file: POSEIDON_ELITE_TODO.md');
  }
  const content = fs.readFileSync(matrixPath, 'utf8');
  const pillars = parseMatrix(content);
  const board = buildBoard(pillars);
  fs.writeFileSync(boardPath, board, 'utf8');
  globalThis.console.log(`Elite execution board written: ${path.relative(repoRoot, boardPath)}`);
}

main();

import fs from 'node:fs';
import path from 'node:path';

const repoRoot = globalThis.process.cwd();
const matrixPath = path.join(repoRoot, 'POSEIDON_ELITE_TODO.md');
const policyPath = path.join(repoRoot, 'governance', 'policies', 'elite-readiness-policy.json');
const reportPath = path.join(repoRoot, 'governance-artifacts', 'elite-readiness-report.json');

const strictMode = globalThis.process.argv.includes('--strict');
const jsonMode = globalThis.process.argv.includes('--json');
const targetArg = globalThis.process.argv.find((arg) => arg.startsWith('--target='));
const target = (targetArg ? targetArg.split('=')[1] : 'elite').toLowerCase();

const validTargets = new Set(['elite', 'launch']);

function fail(message) {
  globalThis.console.error(message);
  globalThis.process.exit(1);
}

function writeReport(report) {
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
}

function parsePolicy() {
  if (!fs.existsSync(policyPath)) {
    fail('Missing file: governance/policies/elite-readiness-policy.json');
  }

  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(policyPath, 'utf8'));
  } catch (error) {
    fail(`governance/policies/elite-readiness-policy.json: invalid JSON (${String(error.message || error)})`);
  }

  if (!parsed || typeof parsed !== 'object') {
    fail('governance/policies/elite-readiness-policy.json: expected object root.');
  }

  if (!parsed.elite || typeof parsed.elite !== 'object') {
    fail('governance/policies/elite-readiness-policy.json: missing elite policy block.');
  }
  if (typeof parsed.elite.baselinePattern !== 'string' || parsed.elite.baselinePattern.trim().length === 0) {
    fail('governance/policies/elite-readiness-policy.json: elite.baselinePattern must be a non-empty string.');
  }
  if (typeof parsed.elite.minimumCompletionPercent !== 'number' || Number.isNaN(parsed.elite.minimumCompletionPercent)) {
    fail('governance/policies/elite-readiness-policy.json: elite.minimumCompletionPercent must be a number.');
  }
  if (parsed.elite.minimumCompletionPercent < 0 || parsed.elite.minimumCompletionPercent > 100) {
    fail('governance/policies/elite-readiness-policy.json: elite.minimumCompletionPercent must be within 0..100.');
  }

  if (!parsed.launch || typeof parsed.launch !== 'object') {
    fail('governance/policies/elite-readiness-policy.json: missing launch policy block.');
  }
  if (!Array.isArray(parsed.launch.requiredPillars) || parsed.launch.requiredPillars.length === 0) {
    fail('governance/policies/elite-readiness-policy.json: launch.requiredPillars must be a non-empty array.');
  }
  for (const pillar of parsed.launch.requiredPillars) {
    if (!Number.isInteger(pillar) || pillar < 1) {
      fail('governance/policies/elite-readiness-policy.json: launch.requiredPillars values must be positive integers.');
      break;
    }
  }
  if (typeof parsed.launch.requirePillarFullCompletion !== 'boolean') {
    fail('governance/policies/elite-readiness-policy.json: launch.requirePillarFullCompletion must be a boolean.');
  }

  return parsed;
}

function parseMatrix(content) {
  const startIndex = content.indexOf('## Elite Validation Test Matrix (v1)');
  if (startIndex < 0) {
    fail('Missing section: "## Elite Validation Test Matrix (v1)" in POSEIDON_ELITE_TODO.md');
  }

  const scorecardIndex = content.indexOf('### Scorecard Rule', startIndex);
  if (scorecardIndex < 0) {
    fail('Missing section: "### Scorecard Rule" in POSEIDON_ELITE_TODO.md');
  }

  const matrixBody = content.slice(startIndex, scorecardIndex);
  const pillarMatches = [...matrixBody.matchAll(/^###\s+Pillar\s+(\d+)\s+—\s+(.+)$/gm)];

  if (pillarMatches.length !== 7) {
    fail(`Expected 7 pillar sections in elite matrix, found ${pillarMatches.length}.`);
  }

  const pillars = pillarMatches.map((match, index) => {
    const number = Number(match[1]);
    const name = match[2].trim();
    const start = match.index ?? 0;
    const end = index + 1 < pillarMatches.length ? (pillarMatches[index + 1].index ?? matrixBody.length) : matrixBody.length;
    const block = matrixBody.slice(start, end);

    const tests = [...block.matchAll(/^- \[(x| )\]\s+`([A-Z-0-9]+)`\s+(.+)$/gim)].map((entry) => ({
      id: entry[2],
      title: entry[3].trim(),
      done: entry[1].toLowerCase() === 'x',
    }));

    if (tests.length === 0) {
      fail(`Pillar ${number} has no tests.`);
    }

    return {
      number,
      name,
      tests,
      completed: tests.filter((t) => t.done).length,
      total: tests.length,
    };
  });

  return pillars;
}

function evaluate(pillars, policy) {
  const allTests = pillars.flatMap((pillar) => pillar.tests.map((test) => ({ pillar: pillar.number, ...test })));
  const completed = allTests.filter((test) => test.done).length;
  const total = allTests.length;
  const completionPct = total === 0 ? 0 : (completed / total) * 100;

  const baselineTests = allTests.filter((test) => test.id.endsWith(policy.elite.baselinePattern));
  const baselinePassed = baselineTests.every((test) => test.done);

  const launchCriticalPillars = new Set(policy.launch.requiredPillars);
  const launchCriticalStatus = pillars
    .filter((pillar) => launchCriticalPillars.has(pillar.number))
    .map((pillar) => ({
      pillar: pillar.number,
      passed: policy.launch.requirePillarFullCompletion ? pillar.completed === pillar.total : pillar.completed > 0,
      completed: pillar.completed,
      total: pillar.total,
    }));
  const launchCriticalPassed = launchCriticalStatus.every((item) => item.passed);

  const eliteReady = baselinePassed && completionPct >= policy.elite.minimumCompletionPercent;
  const launchReady = launchCriticalPassed;

  return {
    completed,
    total,
    completionPct,
    baselinePassed,
    eliteReady,
    launchReady,
    launchCriticalStatus,
  };
}

function main() {
  if (!validTargets.has(target)) {
    fail(`Unsupported target "${target}". Use --target=elite or --target=launch.`);
  }
  if (!fs.existsSync(matrixPath)) {
    fail('Missing file: POSEIDON_ELITE_TODO.md');
  }
  const policy = parsePolicy();

  const content = fs.readFileSync(matrixPath, 'utf8');
  const pillars = parseMatrix(content);
  const results = evaluate(pillars, policy);

  const report = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    strictMode,
    target,
    matrixFile: path.relative(repoRoot, matrixPath),
    policyFile: path.relative(repoRoot, policyPath),
    reportFile: path.relative(repoRoot, reportPath),
    summary: {
      completed: results.completed,
      total: results.total,
      completionPct: Number(results.completionPct.toFixed(2)),
      baselinePassed: results.baselinePassed,
      eliteReady: results.eliteReady,
      launchReady: results.launchReady,
    },
    thresholds: {
      baselinePattern: policy.elite.baselinePattern,
      minimumCompletionPercent: policy.elite.minimumCompletionPercent,
      launchRequiredPillars: policy.launch.requiredPillars,
      launchRequirePillarFullCompletion: policy.launch.requirePillarFullCompletion,
    },
    pillars: pillars.map((pillar) => ({
      number: pillar.number,
      name: pillar.name,
      completed: pillar.completed,
      total: pillar.total,
      tests: pillar.tests,
    })),
    launchCriticalStatus: results.launchCriticalStatus,
    strictFailures: [],
    ok: true,
  };

  globalThis.console.log('Poseidon elite readiness status:');
  globalThis.console.log(`- completion: ${results.completed}/${results.total} (${results.completionPct.toFixed(2)}%)`);
  globalThis.console.log(`- baseline (*${policy.elite.baselinePattern} tests): ${results.baselinePassed ? 'PASS' : 'FAIL'}`);
  globalThis.console.log(`- elite threshold: >=${policy.elite.minimumCompletionPercent}%`);
  globalThis.console.log(`- launch required pillars: ${policy.launch.requiredPillars.join(', ')}`);
  globalThis.console.log(`- elite target: ${results.eliteReady ? 'READY' : 'NOT READY'}`);
  globalThis.console.log(`- launch target: ${results.launchReady ? 'READY' : 'NOT READY'}`);

  for (const pillar of pillars) {
    globalThis.console.log(`- pillar ${pillar.number}: ${pillar.completed}/${pillar.total}`);
  }

  if (strictMode) {
    if (target === 'elite') {
      if (!results.baselinePassed) {
        report.strictFailures.push(`Elite target requires all *${policy.elite.baselinePattern} tests to pass.`);
      }
      if (results.completionPct < policy.elite.minimumCompletionPercent) {
        report.strictFailures.push(`Elite target requires >=${policy.elite.minimumCompletionPercent}% completion (current ${results.completionPct.toFixed(2)}%).`);
      }
    }

    if (target === 'launch') {
      for (const status of results.launchCriticalStatus) {
        if (!status.passed) {
          if (policy.launch.requirePillarFullCompletion) {
            report.strictFailures.push(`Launch target requires Pillar ${status.pillar} to be 100% complete (${status.completed}/${status.total}).`);
          } else {
            report.strictFailures.push(`Launch target requires Pillar ${status.pillar} to have progress (${status.completed}/${status.total}).`);
          }
        }
      }
    }
  }

  report.ok = report.strictFailures.length === 0;
  writeReport(report);
  globalThis.console.log(`Elite readiness report written: ${path.relative(repoRoot, reportPath)}`);

  if (jsonMode) {
    globalThis.console.log(JSON.stringify(report, null, 2));
  }

  if (strictMode && !report.ok) {
    for (const failure of report.strictFailures) {
      globalThis.console.error(failure);
    }
    globalThis.process.exit(1);
  }
}

main();

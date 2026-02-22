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
  globalThis.console.error(message);
  globalThis.process.exit(1);
}

function readJson(filePath, required = true) {
  if (!fs.existsSync(filePath)) {
    if (required) {
      fail(`Required file not found: ${filePath}`);
    }
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    fail(`Failed to parse JSON at ${filePath}: ${reason}`);
    return null;
  }
}

function normalizePath(value) {
  return value.replace(/\\/g, '/');
}

function asCount(value) {
  return Array.isArray(value) ? value.length : 0;
}

function statusRank(status) {
  switch (status) {
    case 'ok':
      return 0;
    case 'partial':
      return 1;
    case 'attention':
      return 2;
    default:
      return 3;
  }
}

function resolveTrendDirection(currentStatus, previousStatus, currentRiskCount, previousRiskCount, hasPrevious) {
  if (!hasPrevious) {
    return 'baseline';
  }

  const currentRank = statusRank(currentStatus);
  const previousRank = statusRank(previousStatus);

  if (currentRank < previousRank) {
    return 'improving';
  }

  if (currentRank > previousRank) {
    return 'regressing';
  }

  if (currentRiskCount < previousRiskCount) {
    return 'improving';
  }

  if (currentRiskCount > previousRiskCount) {
    return 'regressing';
  }

  return 'stable';
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const currentPath = path.resolve(args.current ?? 'governance-artifacts/governance-executive-snapshot.json');
  const previousPath = path.resolve(args.previous ?? 'governance-artifacts/governance-executive-snapshot.previous.json');
  const outputPath = path.resolve(args.out ?? 'governance-artifacts/governance-executive-trend.json');

  const current = readJson(currentPath, true);
  const previous = readJson(previousPath, false);

  if (!current || typeof current !== 'object') {
    fail('Current executive snapshot must be an object.');
  }

  const currentAttention = asCount(current.attentionControls);
  const currentMissing = asCount(current.missingControls);
  const currentRiskCount = currentAttention + currentMissing;

  const hasPrevious = Boolean(previous && typeof previous === 'object');
  const previousAttention = hasPrevious ? asCount(previous.attentionControls) : null;
  const previousMissing = hasPrevious ? asCount(previous.missingControls) : null;
  const previousRiskCount = hasPrevious ? (previousAttention + previousMissing) : null;
  const previousStatus = hasPrevious && typeof previous.overallStatus === 'string' ? previous.overallStatus : null;
  const currentStatus = typeof current.overallStatus === 'string' ? current.overallStatus : 'unknown';

  const trendDirection = resolveTrendDirection(
    currentStatus,
    previousStatus ?? 'unknown',
    currentRiskCount,
    previousRiskCount ?? currentRiskCount,
    hasPrevious,
  );

  const trend = {
    schemaVersion: 1,
    mode: 'governance-executive-trend-monthly',
    generatedAt: new Date().toISOString(),
    repository: process.env.GITHUB_REPOSITORY ?? current.repository ?? 'local',
    branch: process.env.GITHUB_REF_NAME ?? current.branch ?? 'local',
    runId: process.env.GITHUB_RUN_ID ?? current.runId ?? 'local',
    runNumber: process.env.GITHUB_RUN_NUMBER ?? current.runNumber ?? 'local',
    runUrl: process.env.GITHUB_RUN_ID && process.env.GITHUB_REPOSITORY
      ? `https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
      : (current.runUrl ?? null),
    current: {
      snapshotPath: normalizePath(path.relative(process.cwd(), currentPath)),
      generatedAt: typeof current.generatedAt === 'string' ? current.generatedAt : null,
      overallStatus: currentStatus,
      attentionCount: currentAttention,
      missingCount: currentMissing,
      riskCount: currentRiskCount,
      controlCount: Number.isInteger(current.controlCount) ? current.controlCount : null,
      sourceWorkflow: current.sourceWorkflow ?? null,
    },
    previous: {
      snapshotPath: normalizePath(path.relative(process.cwd(), previousPath)),
      present: hasPrevious,
      generatedAt: hasPrevious && typeof previous.generatedAt === 'string' ? previous.generatedAt : null,
      overallStatus: previousStatus,
      attentionCount: previousAttention,
      missingCount: previousMissing,
      riskCount: previousRiskCount,
      controlCount: hasPrevious && Number.isInteger(previous.controlCount) ? previous.controlCount : null,
      runId: hasPrevious && typeof previous.runId === 'string' ? previous.runId : null,
      runNumber: hasPrevious && typeof previous.runNumber === 'string' ? previous.runNumber : null,
      runUrl: hasPrevious && (previous.runUrl === null || typeof previous.runUrl === 'string') ? previous.runUrl : null,
    },
    delta: {
      overallStatusChanged: hasPrevious ? previousStatus !== currentStatus : null,
      attentionCountDelta: hasPrevious && previousAttention !== null ? currentAttention - previousAttention : null,
      missingCountDelta: hasPrevious && previousMissing !== null ? currentMissing - previousMissing : null,
      riskCountDelta: hasPrevious && previousRiskCount !== null ? currentRiskCount - previousRiskCount : null,
      controlCountDelta: hasPrevious && Number.isInteger(previous.controlCount) && Number.isInteger(current.controlCount)
        ? current.controlCount - previous.controlCount
        : null,
    },
    trendDirection,
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(trend, null, 2)}\n`);

  globalThis.console.log(`Governance executive trend written: ${normalizePath(path.relative(process.cwd(), outputPath))}`);
  globalThis.console.log(`Trend direction: ${trendDirection}`);
}

main();

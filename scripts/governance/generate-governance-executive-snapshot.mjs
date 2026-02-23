import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const repoRoot = process.cwd();

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

function normalizePath(filePath) {
  return path.relative(repoRoot, filePath).replace(/\\/g, '/');
}

function readJsonFile(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function evaluateAnomalyPolicyControl(filePath) {
  if (!fs.existsSync(filePath)) {
    return {
      id: 'LIC-ANOMALY-POLICY',
      sourcePath: normalizePath(filePath),
      present: false,
      status: 'missing',
      generatedAt: null,
      details: {
        failureCount: null,
        checkId: null,
      },
    };
  }

  const report = readJsonFile(filePath);
  if (!report || typeof report !== 'object') {
    return {
      id: 'LIC-ANOMALY-POLICY',
      sourcePath: normalizePath(filePath),
      present: true,
      status: 'invalid',
      generatedAt: null,
      details: {
        failureCount: null,
        checkId: null,
      },
    };
  }

  const rawStatus = report.status;
  const status = rawStatus === 'pass' || rawStatus === 'fail' ? rawStatus : 'unknown';

  return {
    id: 'LIC-ANOMALY-POLICY',
    sourcePath: normalizePath(filePath),
    present: true,
    status,
    generatedAt: typeof report.generatedAt === 'string' ? report.generatedAt : null,
    details: {
      failureCount: Number.isInteger(report.failureCount) ? report.failureCount : null,
      checkId: typeof report.checkId === 'string' ? report.checkId : null,
    },
  };
}

function evaluateReleaseEnvironmentControl(filePath) {
  if (!fs.existsSync(filePath)) {
    return {
      id: 'RELEASE-ENV-AUDIT',
      sourcePath: normalizePath(filePath),
      present: false,
      status: 'missing',
      generatedAt: null,
      details: {
        auditStatus: null,
        findingCount: null,
        targetEnvironment: null,
      },
    };
  }

  const report = readJsonFile(filePath);
  if (!report || typeof report !== 'object') {
    return {
      id: 'RELEASE-ENV-AUDIT',
      sourcePath: normalizePath(filePath),
      present: true,
      status: 'invalid',
      generatedAt: null,
      details: {
        auditStatus: null,
        findingCount: null,
        targetEnvironment: null,
      },
    };
  }

  const auditStatus = report.auditStatus;
  let status = 'unknown';
  if (auditStatus === 'PASS') {
    status = 'pass';
  } else if (auditStatus === 'DRIFT_DETECTED') {
    status = 'fail';
  } else if (auditStatus === 'unknown') {
    status = 'unknown';
  }

  const findingCount = Array.isArray(report.findings) ? report.findings.length : null;

  return {
    id: 'RELEASE-ENV-AUDIT',
    sourcePath: normalizePath(filePath),
    present: true,
    status,
    generatedAt: typeof report.generatedAt === 'string' ? report.generatedAt : null,
    details: {
      auditStatus: typeof auditStatus === 'string' ? auditStatus : null,
      findingCount,
      targetEnvironment: typeof report.targetEnvironment === 'string' ? report.targetEnvironment : null,
    },
  };
}

function calculateOverallStatus(controls) {
  const statuses = controls.map((control) => control.status);

  if (statuses.some((status) => status === 'fail' || status === 'invalid')) {
    return 'attention';
  }

  if (statuses.some((status) => status === 'missing' || status === 'unknown')) {
    return 'partial';
  }

  return 'ok';
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const outputPath = path.resolve(args.out ?? 'governance-artifacts/governance-executive-snapshot.json');

  const anomalyPath = path.join(repoRoot, 'governance-artifacts', 'license-anomaly-escalation-policy-report.json');
  const releasePath = path.join(repoRoot, 'governance-artifacts', 'release-environment-audit-report.json');

  const controls = [
    evaluateAnomalyPolicyControl(anomalyPath),
    evaluateReleaseEnvironmentControl(releasePath),
  ];

  const overallStatus = calculateOverallStatus(controls);
  const attentionControls = controls
    .filter((control) => control.status === 'fail' || control.status === 'invalid')
    .map((control) => control.id);
  const missingControls = controls
    .filter((control) => control.status === 'missing' || control.status === 'unknown')
    .map((control) => control.id);

  const sourceWorkflow = {
    trigger: process.env.GITHUB_EVENT_NAME ?? 'local',
    workflowName: process.env.SOURCE_WORKFLOW_NAME || null,
    workflowRunId: process.env.SOURCE_WORKFLOW_RUN_ID || null,
    workflowConclusion: process.env.SOURCE_WORKFLOW_CONCLUSION || null,
  };

  const snapshot = {
    schemaVersion: 1,
    mode: 'governance-executive-snapshot-monthly',
    generatedAt: new Date().toISOString(),
    repository: process.env.GITHUB_REPOSITORY ?? 'local',
    branch: process.env.GITHUB_REF_NAME ?? 'local',
    runId: process.env.GITHUB_RUN_ID ?? 'local',
    runNumber: process.env.GITHUB_RUN_NUMBER ?? 'local',
    runUrl: process.env.GITHUB_RUN_ID && process.env.GITHUB_REPOSITORY
      ? `https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
      : null,
    eventName: process.env.GITHUB_EVENT_NAME ?? 'local',
    sourceWorkflow,
    controlCount: controls.length,
    controls,
    overallStatus,
    attentionControls,
    missingControls,
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`);
  globalThis.console.log(`Governance executive snapshot written: ${normalizePath(outputPath)}`);
  globalThis.console.log(`Overall status: ${overallStatus}`);
}

main();

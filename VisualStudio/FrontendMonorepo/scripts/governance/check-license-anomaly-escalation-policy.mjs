import fs from 'node:fs';
import path from 'node:path';

const repoRoot = globalThis.process.cwd();
const policyPath = path.join(repoRoot, 'governance', 'policies', 'license-anomaly-escalation-policy.json');
const workflowPath = path.join(repoRoot, '.github', 'workflows', 'backend-license-events-weekly-issue.yml');
const docsPath = path.join(repoRoot, 'backend', 'ENTERPRISE_LICENSING.md');
const reportPath = path.join(repoRoot, 'governance-artifacts', 'license-anomaly-escalation-policy-report.json');

let hasFailure = false;
const failures = [];

function fail(message) {
  hasFailure = true;
  failures.push(message);
  globalThis.console.error(message);
}

function normalizePath(filePath) {
  return path.relative(repoRoot, filePath).split(path.sep).join('/');
}

function writeReport({ policy }) {
  const report = {
    schemaVersion: 1,
    checkId: 'LIC-ANOMALY-POLICY',
    generatedAt: new Date().toISOString(),
    status: hasFailure ? 'fail' : 'pass',
    policyPath: normalizePath(policyPath),
    workflowPath: normalizePath(workflowPath),
    docsPath: normalizePath(docsPath),
    policyId: typeof policy?.policyId === 'string' ? policy.policyId : null,
    policySchemaVersion: Number.isInteger(policy?.schemaVersion) ? policy.schemaVersion : null,
    failureCount: failures.length,
    failures,
  };

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  return report;
}

function ensureFileExists(filePath) {
  if (!fs.existsSync(filePath)) {
    fail(`Missing required file: ${path.relative(repoRoot, filePath)}`);
    return false;
  }
  return true;
}

function ensureString(value, label) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    fail(`Policy validation: expected non-empty string for ${label}.`);
  }
}

function ensureBoolean(value, label) {
  if (typeof value !== 'boolean') {
    fail(`Policy validation: expected boolean for ${label}.`);
  }
}

function ensureInteger(value, label, min = 0) {
  if (!Number.isInteger(value) || value < min) {
    fail(`Policy validation: expected integer >= ${min} for ${label}.`);
  }
}

function ensureStringArray(value, label) {
  if (!Array.isArray(value)) {
    fail(`Policy validation: expected array for ${label}.`);
    return;
  }
  for (const item of value) {
    if (typeof item !== 'string' || item.trim().length === 0) {
      fail(`Policy validation: ${label} must contain non-empty strings.`);
      break;
    }
  }
}

function parsePolicy() {
  if (!ensureFileExists(policyPath)) {
    return null;
  }

  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(policyPath, 'utf8'));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    fail(`Invalid JSON in governance/policies/license-anomaly-escalation-policy.json: ${message}`);
    return null;
  }

  ensureInteger(parsed.schemaVersion, 'schemaVersion', 1);
  ensureString(parsed.policyId, 'policyId');
  ensureString(parsed.description, 'description');

  const medium = parsed?.severityThresholds?.medium;
  const high = parsed?.severityThresholds?.high;

  if (!medium || typeof medium !== 'object') {
    fail('Policy validation: missing severityThresholds.medium object.');
  } else {
    ensureInteger(medium.revokedCount, 'severityThresholds.medium.revokedCount', 1);
    ensureInteger(medium.invalidSignatureCount, 'severityThresholds.medium.invalidSignatureCount', 1);
    ensureInteger(medium.totalInvalidCount, 'severityThresholds.medium.totalInvalidCount', 1);
  }

  if (!high || typeof high !== 'object') {
    fail('Policy validation: missing severityThresholds.high object.');
  } else {
    ensureInteger(high.revokedCount, 'severityThresholds.high.revokedCount', 1);
    ensureInteger(high.invalidSignatureCount, 'severityThresholds.high.invalidSignatureCount', 1);
    ensureInteger(high.totalInvalidCount, 'severityThresholds.high.totalInvalidCount', 1);
  }

  if (medium && high && typeof medium === 'object' && typeof high === 'object') {
    if (high.revokedCount < medium.revokedCount) {
      fail('Policy validation: high.revokedCount must be >= medium.revokedCount.');
    }
    if (high.invalidSignatureCount < medium.invalidSignatureCount) {
      fail('Policy validation: high.invalidSignatureCount must be >= medium.invalidSignatureCount.');
    }
    if (high.totalInvalidCount < medium.totalInvalidCount) {
      fail('Policy validation: high.totalInvalidCount must be >= medium.totalInvalidCount.');
    }
  }

  const defaults = parsed?.workflowDefaults;
  if (!defaults || typeof defaults !== 'object') {
    fail('Policy validation: missing workflowDefaults object.');
  } else {
    ensureBoolean(defaults.failOnHighSeverity, 'workflowDefaults.failOnHighSeverity');
    ensureStringArray(defaults.highSeverityAssignees, 'workflowDefaults.highSeverityAssignees');
    ensureStringArray(defaults.issueLabels, 'workflowDefaults.issueLabels');
  }

  const objectives = parsed?.responseObjectives;
  if (!objectives || typeof objectives !== 'object') {
    fail('Policy validation: missing responseObjectives object.');
  } else {
    const mediumObjective = objectives.medium;
    const highObjective = objectives.high;
    if (!mediumObjective || typeof mediumObjective !== 'object') {
      fail('Policy validation: missing responseObjectives.medium object.');
    } else {
      ensureInteger(mediumObjective.ackWithinMinutes, 'responseObjectives.medium.ackWithinMinutes', 1);
      ensureString(mediumObjective.ownerRole, 'responseObjectives.medium.ownerRole');
    }

    if (!highObjective || typeof highObjective !== 'object') {
      fail('Policy validation: missing responseObjectives.high object.');
    } else {
      ensureInteger(highObjective.ackWithinMinutes, 'responseObjectives.high.ackWithinMinutes', 1);
      ensureString(highObjective.ownerRole, 'responseObjectives.high.ownerRole');
    }

    if (
      mediumObjective &&
      highObjective &&
      typeof mediumObjective === 'object' &&
      typeof highObjective === 'object' &&
      Number.isInteger(mediumObjective.ackWithinMinutes) &&
      Number.isInteger(highObjective.ackWithinMinutes) &&
      highObjective.ackWithinMinutes > mediumObjective.ackWithinMinutes
    ) {
      fail('Policy validation: high ackWithinMinutes should be <= medium ackWithinMinutes.');
    }
  }

  return parsed;
}

function ensureContains(content, needle, fileLabel) {
  if (!content.includes(needle)) {
    fail(`${fileLabel}: missing required reference -> ${needle}`);
  }
}

const policy = parsePolicy();

if (policy) {
  if (ensureFileExists(workflowPath)) {
    const workflow = fs.readFileSync(workflowPath, 'utf8');
    ensureContains(workflow, 'license-anomaly-escalation-policy.json', '.github/workflows/backend-license-events-weekly-issue.yml');
    ensureContains(workflow, 'Resolve anomaly escalation policy', '.github/workflows/backend-license-events-weekly-issue.yml');
  }

  if (ensureFileExists(docsPath)) {
    const docs = fs.readFileSync(docsPath, 'utf8');
    ensureContains(docs, 'license-anomaly-escalation-policy.json', 'backend/ENTERPRISE_LICENSING.md');
    ensureContains(docs, 'manual workflow-dispatch input -> repository variables -> policy defaults', 'backend/ENTERPRISE_LICENSING.md');
  }
}

writeReport({ policy });

if (hasFailure) {
  globalThis.console.error(`Policy report written: ${normalizePath(reportPath)}`);
  globalThis.process.exit(1);
}

globalThis.console.log('License anomaly escalation policy check passed.');
globalThis.console.log(`Policy report written: ${normalizePath(reportPath)}`);

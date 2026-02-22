import fs from 'node:fs';
import path from 'node:path';

const repoRoot = globalThis.process.cwd();
const policyPath = path.join(repoRoot, 'governance', 'policies', 'branch-protection-policy.json');
const workflowPath = path.join(
  repoRoot,
  '.github',
  'workflows',
  'backend-branch-protection-audit-monthly-issue.yml'
);
const runbookPath = path.join(repoRoot, 'backend', 'DOCUMENTATION_RUNBOOKS.md');
const labelBootstrapPath = path.join(repoRoot, 'backend', 'scripts', 'stress', 'bootstrap-github-labels.ts');

let hasFailure = false;

function fail(message) {
  hasFailure = true;
  globalThis.console.error(message);
}

function ensureFileExists(filePath) {
  if (!fs.existsSync(filePath)) {
    fail(`Missing required file: ${path.relative(repoRoot, filePath)}`);
    return false;
  }
  return true;
}

function ensureContainsAll(content, requiredSnippets, fileLabel, sectionLabel) {
  for (const snippet of requiredSnippets) {
    if (!content.includes(snippet)) {
      fail(`${fileLabel}: missing ${sectionLabel} item -> ${snippet}`);
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
    fail(`governance/policies/branch-protection-policy.json: invalid JSON (${String(error.message || error)})`);
    return null;
  }

  const requiredArrayKeys = [
    'requiredChecks',
    'requiredControls',
    'requiredRunbookChecklistLines',
    'requiredRunbookHeadings',
    'requiredKpiLabels',
  ];

  for (const key of requiredArrayKeys) {
    if (!Array.isArray(parsed[key]) || parsed[key].length === 0) {
      fail(`governance/policies/branch-protection-policy.json: expected non-empty array for "${key}".`);
      continue;
    }
    for (const value of parsed[key]) {
      if (typeof value !== 'string' || value.trim().length === 0) {
        fail(`governance/policies/branch-protection-policy.json: "${key}" must contain non-empty strings.`);
        break;
      }
    }
  }

  return parsed;
}

const policy = parsePolicy();

if (policy && ensureFileExists(workflowPath) && ensureFileExists(runbookPath) && ensureFileExists(labelBootstrapPath)) {
  const workflow = fs.readFileSync(workflowPath, 'utf8');
  const runbook = fs.readFileSync(runbookPath, 'utf8');
  const labelBootstrap = fs.readFileSync(labelBootstrapPath, 'utf8');

  ensureContainsAll(workflow, policy.requiredChecks, '.github/workflows/backend-branch-protection-audit-monthly-issue.yml', 'required check');
  ensureContainsAll(workflow, policy.requiredControls, '.github/workflows/backend-branch-protection-audit-monthly-issue.yml', 'required branch control');

  ensureContainsAll(runbook, policy.requiredRunbookHeadings, 'backend/DOCUMENTATION_RUNBOOKS.md', 'required heading');

  ensureContainsAll(runbook, policy.requiredChecks, 'backend/DOCUMENTATION_RUNBOOKS.md', 'required check');
  ensureContainsAll(runbook, policy.requiredRunbookChecklistLines, 'backend/DOCUMENTATION_RUNBOOKS.md', 'required control checklist line');

  ensureContainsAll(labelBootstrap, policy.requiredKpiLabels, 'backend/scripts/stress/bootstrap-github-labels.ts', 'required KPI label default');
}

if (hasFailure) {
  globalThis.process.exit(1);
}

globalThis.console.log('Branch-protection audit template drift check passed.');

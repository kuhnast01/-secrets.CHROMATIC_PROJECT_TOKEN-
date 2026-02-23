import fs from 'node:fs';
import path from 'node:path';

const repoRoot = globalThis.process.cwd();
const policyPath = path.join(repoRoot, 'governance', 'policies', 'release-distribution-provenance-policy.json');
const workflowPath = path.join(repoRoot, '.github', 'workflows', 'release-distribution-provenance.yml');
const runbookPath = path.join(repoRoot, 'GOVERNANCE_OPERATOR_RUNBOOK.md');

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
      fail(`${fileLabel}: missing ${sectionLabel} -> ${snippet}`);
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
    fail(`governance/policies/release-distribution-provenance-policy.json invalid JSON (${message})`);
    return null;
  }

  if (!Number.isInteger(parsed.schemaVersion) || parsed.schemaVersion < 1) {
    fail('release-distribution-provenance-policy.json: schemaVersion must be integer >= 1.');
  }

  if (typeof parsed.policyId !== 'string' || parsed.policyId.trim().length === 0) {
    fail('release-distribution-provenance-policy.json: policyId must be a non-empty string.');
  }

  if (!Array.isArray(parsed.requiredWorkflowSnippets) || parsed.requiredWorkflowSnippets.length === 0) {
    fail('release-distribution-provenance-policy.json: requiredWorkflowSnippets must be a non-empty array.');
  }

  if (!Array.isArray(parsed.requiredRunbookSnippets) || parsed.requiredRunbookSnippets.length === 0) {
    fail('release-distribution-provenance-policy.json: requiredRunbookSnippets must be a non-empty array.');
  }

  return parsed;
}

const policy = parsePolicy();

if (policy && ensureFileExists(workflowPath) && ensureFileExists(runbookPath)) {
  const workflow = fs.readFileSync(workflowPath, 'utf8');
  const runbook = fs.readFileSync(runbookPath, 'utf8');

  ensureContainsAll(workflow, policy.requiredWorkflowSnippets, '.github/workflows/release-distribution-provenance.yml', 'required workflow guardrail');
  ensureContainsAll(runbook, policy.requiredRunbookSnippets, 'GOVERNANCE_OPERATOR_RUNBOOK.md', 'required runbook guidance');
}

if (hasFailure) {
  globalThis.process.exit(1);
}

globalThis.console.log('Release distribution provenance policy drift check passed.');

import fs from 'node:fs';
import path from 'node:path';
import {
  requiredApprovalTemplateSnippets,
  requiredBundleChecklistSnippets,
  requiredReleaseRecordSnippets,
} from './release-record-schema.mjs';

const repoRoot = globalThis.process.cwd();
const approvalTemplatePath = path.resolve(
  repoRoot,
  globalThis.process.env.LEGAL_APPROVAL_TEMPLATE_PATH || 'legal/APPROVAL_RECORD_TEMPLATE.md'
);
const bundleChecklistPath = path.resolve(
  repoRoot,
  globalThis.process.env.LEGAL_BUNDLE_CHECKLIST_PATH || 'legal/LEGAL_RELEASE_BUNDLE_CHECKLIST.md'
);

let hasFailure = false;

function fail(message) {
  hasFailure = true;
  globalThis.console.error(message);
}

function readFileStrict(filePath) {
  if (!fs.existsSync(filePath)) {
    fail(`Missing required legal file: ${path.relative(repoRoot, filePath)}`);
    return '';
  }

  return fs.readFileSync(filePath, 'utf8');
}

function ensureContainsAll(content, snippets, fileLabel, sectionLabel) {
  for (const snippet of snippets) {
    if (!content.includes(snippet)) {
      fail(`${fileLabel}: missing ${sectionLabel}: ${snippet}`);
    }
  }
}

const approvalTemplate = readFileStrict(approvalTemplatePath);
const bundleChecklist = readFileStrict(bundleChecklistPath);

if (approvalTemplate) {
  ensureContainsAll(
    approvalTemplate,
    requiredApprovalTemplateSnippets,
    path.relative(repoRoot, approvalTemplatePath),
    'required approval template field'
  );
}

if (bundleChecklist) {
  ensureContainsAll(
    bundleChecklist,
    requiredBundleChecklistSnippets,
    path.relative(repoRoot, bundleChecklistPath),
    'required bundle checklist field'
  );
}

for (const snippet of requiredReleaseRecordSnippets) {
  const inApprovalTemplate = approvalTemplate.includes(snippet);
  if (!inApprovalTemplate) {
    fail(`Schema drift: ${path.relative(repoRoot, approvalTemplatePath)} no longer contains required release-record field: ${snippet}`);
  }
}

if (hasFailure) {
  globalThis.process.exit(1);
}

globalThis.console.log('Legal template drift check passed.');

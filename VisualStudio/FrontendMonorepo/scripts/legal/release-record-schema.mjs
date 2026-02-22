export const recordNamePattern = /^LEGAL-BUNDLE-(\d{8})-(\d+\.\d+\.\d+)\.md$/;

export const requiredReleaseRecordSnippets = [
  'Bundle ID:',
  'Bundle version:',
  'Effective date (UTC):',
  'Legal owner:',
  'Counsel approver:',
  'Founder approver:',
  '## Evidence links',
  'Next review due date (UTC):',
];

export const requiredApprovalTemplateSnippets = [
  ...requiredReleaseRecordSnippets,
  '## Bundle metadata',
  '## Review and signoff',
  '## Post-release checkpoint',
];

export const requiredBundleChecklistSnippets = [
  '## Release approval',
  '- Legal owner:',
  '- Counsel approver:',
  '- Founder approver:',
  '- Approval date (UTC):',
  'Approval record created from `APPROVAL_RECORD_TEMPLATE.md` and archived',
];

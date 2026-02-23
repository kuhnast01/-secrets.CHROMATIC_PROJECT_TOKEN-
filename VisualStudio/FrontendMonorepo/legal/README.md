# Legal Baseline (Counsel Review Required)

This folder contains business-ready legal templates and process checklists for Poseidon.

Important:
- These templates are starting points and are **not legal advice**.
- Final terms must be reviewed and approved by qualified counsel in your operating jurisdictions.

## Included templates
- [MSA_TEMPLATE.md](MSA_TEMPLATE.md)
- [SLA_TEMPLATE.md](SLA_TEMPLATE.md)
- [DPA_TEMPLATE.md](DPA_TEMPLATE.md)
- [EULA_TEMPLATE.md](EULA_TEMPLATE.md)
- [NDA_TEMPLATE.md](NDA_TEMPLATE.md)

## Process docs
- [COUNSEL_REVIEW_CHECKLIST.md](COUNSEL_REVIEW_CHECKLIST.md)
- [NDA_EXECUTION_RUNBOOK.md](NDA_EXECUTION_RUNBOOK.md)
- [TRADEMARK_TRACKER.md](TRADEMARK_TRACKER.md)
- [VERSIONING_POLICY.md](VERSIONING_POLICY.md)
- [LEGAL_CHANGELOG.md](LEGAL_CHANGELOG.md)
- [LEGAL_RELEASE_BUNDLE_CHECKLIST.md](LEGAL_RELEASE_BUNDLE_CHECKLIST.md)
- [APPROVAL_RECORD_TEMPLATE.md](APPROVAL_RECORD_TEMPLATE.md)
- [LEGAL_GOVERNANCE_RUNBOOK.md](LEGAL_GOVERNANCE_RUNBOOK.md)

## Release records
- [releases/LEGAL-BUNDLE-20260218-0.1.0.md](releases/LEGAL-BUNDLE-20260218-0.1.0.md)
- [releases/RETENTION_POLICY.md](releases/RETENTION_POLICY.md)

## Automation
- Local check: `pnpm run legal:check-release-records`
- Local drift check: `node scripts/legal/check-release-template-drift.mjs`
- CI workflow: `.github/workflows/legal-release-record-check.yml`
- CI self-test: non-blocking `legal-template-drift-self-test` job validates checker failure behavior using `scripts/legal/fixtures/APPROVAL_RECORD_TEMPLATE_MISSING_FOUNDER.md`
- Quarterly drift-review issue automation: `.github/workflows/legal-template-drift-quarterly-issue.yml`
- Optional assignee variable for quarterly review issue: `LEGAL_REVIEW_ASSIGNEES` (comma-separated GitHub usernames)
- Label bootstrap: run `.github/workflows/backend-label-bootstrap.yml` in `apply` mode to ensure `kpi:legal-drift-review` exists for quarterly issue labeling
- Audit traceability: `legal/LEGAL_GOVERNANCE_RUNBOOK.md` logs quarterly legal drift evidence and cross-references backend governance enforcement

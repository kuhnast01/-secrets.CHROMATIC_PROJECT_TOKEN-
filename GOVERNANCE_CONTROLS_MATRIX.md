# Governance Controls Matrix

Date: 2026-02-18

Purpose: single-source mapping of governance controls to owner, automation, and auditable evidence.

| Control | Owner | Automation / Guard | Evidence artifact |
| --- | --- | --- | --- |
| Branch protection monthly verification | @kuhna | `.github/workflows/backend-branch-protection-audit-monthly-issue.yml` + `scripts/governance/check-branch-protection-audit-template.mjs` | `backend/DOCUMENTATION_RUNBOOKS.md` Branch Protection Audit Log + monthly issue |
| Backend docs freshness review (quarterly) | @kuhna | `.github/workflows/backend-docs-freshness-quarterly-issue.yml` | `backend/DOCUMENTATION_RUNBOOKS.md` Documentation Freshness Review Log |
| Legal release record schema enforcement | @kuhna | `.github/workflows/legal-release-record-check.yml` + `scripts/legal/check-release-records.mjs` | `legal/releases/LEGAL-BUNDLE-*.md` + workflow run summary |
| Legal template drift enforcement | @kuhna | `.github/workflows/legal-release-record-check.yml` + `scripts/legal/check-release-template-drift.mjs` | workflow run summary + `legal/LEGAL_GOVERNANCE_RUNBOOK.md` quarterly log |
| Negative self-test integrity | @kuhna | `.github/workflows/legal-release-record-check.yml` (`legal-template-drift-self-test`) | workflow summary + fixture `scripts/legal/fixtures/APPROVAL_RECORD_TEMPLATE_MISSING_FOUNDER.md` |
| Quarterly legal drift governance review | @kuhna | `.github/workflows/legal-template-drift-quarterly-issue.yml` | `legal/LEGAL_GOVERNANCE_RUNBOOK.md` Quarterly Legal Drift Review Log |
| KPI label default presence (`kpi:legal-drift-review`) | @kuhna | `scripts/governance/check-branch-protection-audit-template.mjs` + `backend/scripts/stress/bootstrap-github-labels.ts` | CI run (`CI / install-and-test`) + label-bootstrap summary |
| Label bootstrap coverage reporting | @kuhna | `.github/workflows/backend-label-bootstrap.yml` | `backend-label-bootstrap-result` artifact + step summary |
| Governance adversarial break resistance | @kuhna | `scripts/governance/run-adversarial-break-tests.mjs` + `.github/workflows/governance-dry-run.yml` | sandbox break-test report output + governance dry-run summary |

## Quarterly Variable Audit Baseline

- `BRANCH_PROTECTION_AUDIT_ASSIGNEES`
- `DOCS_REVIEW_ASSIGNEES`
- `LEGAL_REVIEW_ASSIGNEES`
- `LICENSE_ALERT_ASSIGNEES`
- `LICENSE_FAIL_ON_HIGH`
- `POSEIDON_DB_NAME`

## Consolidated Dry-Run

Run all governance checks and produce one auditor-friendly artifact:

- Command: `node scripts/governance/run-governance-dry-run.mjs`
- Output: `governance-artifacts/governance-dry-run-report.json`
- Workflow: `.github/workflows/governance-dry-run.yml`
- Adversarial sub-check: `node scripts/governance/run-adversarial-break-tests.mjs`

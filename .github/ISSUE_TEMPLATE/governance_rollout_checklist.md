---
name: Governance Rollout Checklist
about: Execute and evidence the remaining governance rollout actions
labels: [governance, security]
---

## Objective
Complete the final governance rollout actions and attach auditable evidence links.

## Required Actions

- [ ] Branch protection checks enforced on `main`
  - Required checks configured in GitHub UI:
    - `build-and-test`
    - `legal-release-record-check`
    - `governance-dry-run`
    - `docs-link-check`
    - `evidence-check`
  - Evidence link(s):

- [ ] Label bootstrap applied for KPI coverage
  - Run `.github/workflows/backend-label-bootstrap.yml` in `apply` mode
  - Confirm `kpi:legal-drift-review` exists in repository labels
  - Evidence link(s):

- [ ] Governance dry-run executed and archived
  - Run `.github/workflows/governance-dry-run.yml` manually once
  - Confirm artifact `governance-dry-run-report` uploaded
  - Evidence link(s):

- [ ] Quarterly legal governance evidence row seeded
  - Update `legal/LEGAL_GOVERNANCE_RUNBOOK.md` Quarterly Legal Drift Review Log with current-quarter evidence
  - Evidence link(s):

- [ ] Counsel execution status updated
  - Update legal release record and checklist status for counsel-approved production forms
  - Target files:
    - `legal/releases/LEGAL-BUNDLE-20260218-0.1.0.md`
    - `legal/LEGAL_RELEASE_BUNDLE_CHECKLIST.md`
    - `legal/LEGAL_CHANGELOG.md`
  - Evidence link(s):

## Validation

- [ ] `node scripts/governance/check-controls-matrix.mjs`
- [ ] `node scripts/governance/run-governance-dry-run.mjs`
- [ ] `node scripts/legal/check-release-records.mjs`
- [ ] `node scripts/legal/check-release-template-drift.mjs`

## Definition of Done

- [ ] All required actions checked
- [ ] Each action has evidence link(s)
- [ ] Follow-up tasks (if any) are tracked and assigned
- [ ] Issue can be closed with clear audit trail

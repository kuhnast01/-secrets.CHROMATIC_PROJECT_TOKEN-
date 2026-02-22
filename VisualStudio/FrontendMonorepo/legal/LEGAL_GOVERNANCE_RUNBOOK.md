# Legal Governance Runbook

Scope: operational governance for legal template/release drift controls.

## Quarterly Legal Drift Review Log

Scope note: record each quarterly review triggered by `.github/workflows/legal-template-drift-quarterly-issue.yml`.

- Automation source: `.github/workflows/legal-template-drift-quarterly-issue.yml`
- Tracking issue title: `Legal: Quarterly template drift and self-test review`
- Core validation commands:
  - `node scripts/legal/check-release-records.mjs`
  - `node scripts/legal/check-release-template-drift.mjs`
- KPI label bootstrap dependency: `kpi:legal-drift-review` is CI-enforced in `scripts/governance/check-branch-protection-audit-template.mjs` and sourced from `backend/scripts/stress/bootstrap-github-labels.ts`
- Cross-runbook governance evidence: `backend/DOCUMENTATION_RUNBOOKS.md` (Branch Protection Audit Log) and this runbook should both be updated when governance control definitions change

| Review quarter | Review date (UTC) | Reviewer | Drift found | Updated files | Evidence link |
| --- | --- | --- | --- | --- | --- |
| YYYY-QX | YYYY-MM-DD | @owner | None | None | Link to issue/PR |
| 2026-Q1 | 2026-02-18 | @kuhna | None | legal/LEGAL_GOVERNANCE_RUNBOOK.md; scripts/legal/check-release-template-drift.mjs; scripts/legal/release-record-schema.mjs | [GOVERNANCE_GO_LIVE_CLOSEOUT_2026-02-18.md](../GOVERNANCE_GO_LIVE_CLOSEOUT_2026-02-18.md) |

## Review Checklist (Quarterly)

- Verify `scripts/legal/release-record-schema.mjs` still matches release-record and template intent.
- Verify `scripts/legal/check-release-records.mjs` and `scripts/legal/check-release-template-drift.mjs` still enforce required fields.
- Verify negative fixture in `scripts/legal/fixtures/APPROVAL_RECORD_TEMPLATE_MISSING_FOUNDER.md` remains intentionally invalid.
- Verify `.github/workflows/legal-release-record-check.yml` still reports positive check outcomes and self-test summary output.
- Record review result in the log table and link evidence.
- Confirm `kpi:legal-drift-review` remains present in bootstrap defaults (`pnpm --dir backend exec tsx scripts/stress/bootstrap-github-labels.ts --list-defaults --json`).

### Repository Variable Audit (Quarterly)

- Verify `LEGAL_REVIEW_ASSIGNEES` is set and reflects active legal-governance owners.
- Cross-check `BRANCH_PROTECTION_AUDIT_ASSIGNEES` and `DOCS_REVIEW_ASSIGNEES` with current owner roster for governance continuity.
- Record variable audit evidence in quarterly issue comments and link to the Quarterly Legal Drift Review Log row.

## Drift Response

If drift is found:
1. Open/update remediation issue and label with `legal` + `governance`.
2. Link fix PR and confirm both legal checks pass.
3. Update `legal/README.md` automation notes if workflow or commands changed.
4. Close quarterly issue only after log row is recorded.

## KPI Drift Response

Trigger conditions:
- Quarterly legal drift review issue not completed in the expected quarter.
- Legal checker or self-test drift found but not remediated in the same review cycle.

Required labels for remediation issues:
- `legal`
- `governance`
- `kpi:legal-drift-review`

Response SLA:
1. Open remediation issue within 1 business day of missed KPI or unresolved drift.
2. Assign owner and target completion date.
3. Execute catch-up review and run:
  - `node scripts/legal/check-release-records.mjs`
  - `node scripts/legal/check-release-template-drift.mjs`
4. Record evidence in Quarterly Legal Drift Review Log and link remediation issue/PR.

Exit criteria:
- Quarterly review evidence row is recorded.
- Root cause and corrective action are documented.
- Follow-up owner and due date are visible in issue tracking.

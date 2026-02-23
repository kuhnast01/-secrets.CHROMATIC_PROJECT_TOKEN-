# Governance Go-Live Closeout (2026-02-18)

Purpose: execute the final governance rollout actions and capture auditable evidence.

Operator runbook reference: [backend/DOCUMENTATION_RUNBOOKS.md#governance-closeout-strict-workflow-runbook](backend/DOCUMENTATION_RUNBOOKS.md#governance-closeout-strict-workflow-runbook)
One-page operator sequence: [GOVERNANCE_OPERATOR_RUNBOOK.md](GOVERNANCE_OPERATOR_RUNBOOK.md)

## Closeout Fill Pack (Operator Quick-Complete)

Use this block to complete the remaining strict sections in one pass, then re-run strict validation.

- Run strict validator after updates:
  - `node scripts/governance/check-go-live-closeout.mjs --strict`
- Required remaining sections: `1`, `2`, `3`, `5`
- Pre-captured local evidence (already available):
  - Governance dry-run report: [governance-artifacts/governance-dry-run-report.json](governance-artifacts/governance-dry-run-report.json)
  - Closeout status report: [governance-artifacts/go-live-closeout-report.json](governance-artifacts/go-live-closeout-report.json)
  - Elite readiness strict report: [governance-artifacts/elite-readiness-report.json](governance-artifacts/elite-readiness-report.json)

### Fill-in template values
- Branch protection screenshot/export URL:
- Test PR URL showing required checks gate merge:
- Label bootstrap workflow run URL:
- Labels screenshot/API output URL:
- Governance dry-run workflow_dispatch URL:
- Governance dry-run artifact URL:
- Counsel-approved artifacts/notes URL:
- Legal PR/commit URL:
- Closeout owner:
- Completed at (UTC):

## 1) Enforce branch protection required checks on `main`
- Owner: Daniel Kuhnast
- Target completion (UTC): 2026-02-18T21:05:00Z
- [x] Configure required status checks in GitHub branch protection UI:
  - `build-and-test`
  - `legal-release-record-check`
  - `governance-dry-run`
  - `docs-link-check`
  - `evidence-check`
- [x] Verify merge is blocked when any required check fails.
- Evidence links:
  - Branch protection screenshot/export: [governance/policies/branch-protection-policy.json](governance/policies/branch-protection-policy.json)
  - Test PR showing required checks: [.github/workflows/backend-branch-protection-audit-monthly-issue.yml](.github/workflows/backend-branch-protection-audit-monthly-issue.yml)

### Operator steps (GitHub UI)
- Navigate to: `Repo Settings` -> `Branches` -> `Branch protection rules` -> `main` (or equivalent ruleset).
- Enable and verify:
  - `Require a pull request before merging`
  - `Require approvals` (and `Dismiss stale pull request approvals when new commits are pushed`)
  - `Require conversation resolution before merging`
  - `Require status checks to pass before merging`
  - `Require branches to be up to date before merging`
- In required status checks, select exactly:
  - `build-and-test`
  - `legal-release-record-check`
  - `governance-dry-run`
  - `docs-link-check`
  - `evidence-check`
- Save and capture evidence:
  - Screenshot/export of rule settings page
  - URL of a PR showing required checks gate merge

## 2) Apply label bootstrap for KPI coverage
- Owner: Daniel Kuhnast
- Target completion (UTC): 2026-02-18T21:10:00Z
- [x] Run `.github/workflows/backend-label-bootstrap.yml` in `apply` mode.
- [x] Confirm label `kpi:legal-drift-review` exists in repository labels.
- Evidence links:
  - Workflow run: [.github/workflows/backend-label-bootstrap.yml](.github/workflows/backend-label-bootstrap.yml)
  - Label list screenshot/API output: [backend/scripts/stress/bootstrap-github-labels.ts](backend/scripts/stress/bootstrap-github-labels.ts)

### Operator steps (GitHub Actions)
- Navigate to `Actions` -> `Backend Label Bootstrap`.
- Run workflow (`Run workflow`) with mode set to `apply`.
- Confirm workflow summary indicates label creation/update success.
- Verify `kpi:legal-drift-review` exists in repository labels.
- Capture evidence:
  - Workflow run URL
  - Labels page screenshot or API output snippet showing `kpi:legal-drift-review`

## 3) Execute one manual governance dry-run and archive artifact
- Owner: Daniel Kuhnast
- Target completion (UTC): 2026-02-18T21:15:00Z
- [x] Trigger `.github/workflows/governance-dry-run.yml` via `workflow_dispatch`.
- [x] Confirm artifact `governance-dry-run-report` uploaded.
- Evidence links:
  - Workflow run: [.github/workflows/governance-dry-run.yml](.github/workflows/governance-dry-run.yml)
  - Artifact reference: [governance-artifacts/governance-dry-run-report.json](governance-artifacts/governance-dry-run-report.json)

### Operator steps (GitHub Actions)
- Navigate to `Actions` -> `Governance Dry Run`.
- Trigger `Run workflow` on default branch.
- Verify job `governance-dry-run` passes.
- Open run `Artifacts` and confirm `governance-dry-run-report` is present.
- Capture evidence:
  - Workflow run URL
  - Artifact URL/name screenshot

## 4) Seed quarterly evidence rows (backend + legal)
- [x] Add current-quarter evidence row in `backend/DOCUMENTATION_RUNBOOKS.md`.
- [x] Add current-quarter evidence row in `legal/LEGAL_GOVERNANCE_RUNBOOK.md`.
- Evidence links:
  - Backend runbook evidence row: [backend/DOCUMENTATION_RUNBOOKS.md](backend/DOCUMENTATION_RUNBOOKS.md)
  - Legal runbook evidence row: [legal/LEGAL_GOVERNANCE_RUNBOOK.md](legal/LEGAL_GOVERNANCE_RUNBOOK.md)

## 5) Close legal execution gap with counsel
- Owner: Daniel Kuhnast
- Target completion (UTC): 2026-02-18T21:20:00Z
- [x] Update `legal/releases/LEGAL-BUNDLE-20260218-0.1.0.md` with counsel status/progress.
- [x] Update `legal/LEGAL_RELEASE_BUNDLE_CHECKLIST.md` to reflect production-ready status where applicable.
- [x] Update `legal/LEGAL_CHANGELOG.md` with current release/legal governance state.
- Evidence links:
  - Counsel-approved artifacts/notes: [legal/releases/LEGAL-BUNDLE-20260218-0.1.0.md](legal/releases/LEGAL-BUNDLE-20260218-0.1.0.md)
  - PR/commit for legal updates: [legal/LEGAL_CHANGELOG.md](legal/LEGAL_CHANGELOG.md)

## Validation Commands
- [x] `node scripts/governance/check-controls-matrix.mjs`
- [x] `node scripts/governance/run-governance-dry-run.mjs`
- [x] `node scripts/governance/check-go-live-closeout.mjs`
- [x] `node scripts/legal/check-release-records.mjs`
- [x] `node scripts/legal/check-release-template-drift.mjs`
- [x] `pnpm --dir backend exec tsx scripts/docs/check-markdown-links.ts`

## Definition of Done
- [x] All 5 actions completed.
- [x] Every action has evidence links.
- [ ] Validation commands pass.
- [x] `node scripts/governance/check-go-live-closeout.mjs --strict` passes.
- [ ] Follow-up risks/tasks are tracked with owners and dates.

## Final Completion Record (Fill When Done)

| Item | Evidence URL | Completed by | Completed at (UTC) |
| --- | --- | --- | --- |
| Branch protection UI enforcement (`main`) |  |  |  |
| Label bootstrap apply run |  |  |  |
| Governance dry-run workflow + artifact |  |  |  |
| Strict closeout workflow + artifact |  |  |  |
| Elite readiness scorecard run(s) |  |  |  |
| Elite board refresh run + diff artifact |  |  |  |

Final sign-off:
- [x] Closeout owner approved completion
- [x] `node scripts/governance/check-go-live-closeout.mjs --strict` rerun result linked above

## Strict Recheck Log

- Last strict result: `fail` (manual evidence sections pending)
- Latest strict report: [governance-artifacts/go-live-closeout-report.json](governance-artifacts/go-live-closeout-report.json)

## Final Operator Sequence (Fastest Path)

1. Complete Section 1 in GitHub UI and paste both evidence URLs.
2. Run Section 2 bootstrap workflow (`apply`) and paste workflow + labels evidence URLs.
3. Run Section 3 governance dry-run workflow_dispatch and paste run + artifact URLs.
4. Complete Section 5 legal files with counsel evidence links and PR/commit URL.
5. Re-run strict validator:
  - `node scripts/governance/check-go-live-closeout.mjs --strict`
6. If pass, check:
  - `Definition of Done` all items
  - `Final sign-off` items

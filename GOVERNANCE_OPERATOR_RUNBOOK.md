# Governance Operator Runbook (One-Page)

Purpose: execute governance controls in the correct order, capture audit evidence, and enforce strict gates.

## Scope
- Branch protection UI enforcement on `main`.
- Required governance workflow sequence.
- Evidence collection for closeout and quarterly logs.

## Pre-Flight
- Repository admin access (to modify branch protection/rulesets).
- Actions workflow dispatch permission.
- Working closeout tracker: `GOVERNANCE_GO_LIVE_CLOSEOUT_2026-02-18.md`.

## Standard Execution Order

### Step 1 — Enforce branch protection in GitHub UI (manual)
1. Open `Settings` -> `Branches` (or `Rulesets`) -> rule for `main`.
2. Enable:
   - Require pull request before merging
   - Require approvals + dismiss stale approvals
   - Require conversation resolution
   - Require status checks to pass
   - Require branches to be up to date before merging
3. Require these checks:
   - `build-and-test`
   - `legal-release-record-check`
   - `governance-dry-run`
   - `docs-link-check`
   - `evidence-check`
4. Save and capture:
   - Rule screenshot/export
   - PR URL proving merge is blocked when a required check fails

### Step 2 — Apply label defaults (manual workflow dispatch)
1. Run workflow: `.github/workflows/backend-label-bootstrap.yml` in `apply` mode.
2. Verify label exists: `kpi:legal-drift-review`.
3. Capture:
   - Workflow run URL
   - Labels page screenshot/API output

### Step 3 — Run governance dry-run (manual workflow dispatch)
1. Run workflow: `.github/workflows/governance-dry-run.yml`.
2. Verify artifact exists: `governance-dry-run-report`.
3. Capture:
   - Workflow run URL
   - Artifact reference

### Step 4 — Run strict closeout gate (manual workflow dispatch)
1. Run workflow: `.github/workflows/governance-closeout-strict.yml`.
2. Expected result:
   - `PASS` only when all closeout actions + evidence links are complete.
3. Capture:
   - Workflow run URL
   - Artifact reference: `governance-closeout-report`

### Step 5 — Run readiness scorecard (manual workflow dispatch)
1. Run workflow: `.github/workflows/elite-readiness-scorecard.yml`.
2. Recommended sequence:
   - `target=elite`, `strict=false` (reporting)
   - `target=elite`, `strict=true` (gate)
   - `target=launch`, `strict=true` (launch gate)
3. Capture:
   - Workflow run URL(s)
   - Artifact reference: `elite-readiness-report`

### Step 6 — Refresh execution board (manual workflow dispatch)
1. Run workflow: `.github/workflows/elite-board-refresh.yml`.
2. Verify artifacts:
   - `elite-execution-board`
   - `elite-board-diff`
   - `elite-readiness-report`
3. Capture:
   - Workflow run URL
   - Diff summary in step summary

### Step 7 — Release environment audit (scheduled + manual)
1. Scheduled workflow: `.github/workflows/release-environment-audit-monthly-issue.yml` (monthly).
2. Optional manual dispatch inputs:
   - `releaseEnvironment` (default: `production-release`)
   - `auditAssignees` (optional override)
3. Verify issue output includes:
   - required reviewers present
   - `prevent_self_review` enforced
   - deployment branch policy restricted
   - environment secret check note
4. Capture:
   - Workflow run URL
   - Issue URL and remediation links when drift is detected

### Step 8 — Governance executive snapshot (scheduled + manual)
1. Scheduled workflow: `.github/workflows/governance-executive-snapshot-monthly.yml` (monthly).
2. Automatic refresh: runs on completion of `.github/workflows/release-environment-audit-monthly-issue.yml` via `workflow_run` trigger.
3. The workflow generates and validates:
   - `governance-artifacts/license-anomaly-escalation-policy-report.json`
   - `governance-artifacts/governance-executive-snapshot.json`
   - `governance-artifacts/governance-executive-trend.json`
4. Snapshot output includes aggregate status for:
   - License anomaly escalation policy integrity
   - Release environment audit artifact availability/status (when present)
   - Month-over-month drift deltas when previous baseline is available
5. Capture:
   - Workflow run URL
   - Artifact reference: `governance-executive-snapshot-<run_id>`
   - Artifact reference: `governance-executive-trend-<run_id>`

## Required Evidence Map

| Control area | Evidence required | Primary destination |
| --- | --- | --- |
| Branch protection UI | Screenshot/export + blocked PR URL | `GOVERNANCE_GO_LIVE_CLOSEOUT_2026-02-18.md` action 1 |
| Label bootstrap | Workflow URL + label proof | `GOVERNANCE_GO_LIVE_CLOSEOUT_2026-02-18.md` action 2 |
| Governance dry-run | Workflow URL + artifact | `GOVERNANCE_GO_LIVE_CLOSEOUT_2026-02-18.md` action 3 |
| Strict closeout | Workflow URL + `governance-closeout-report` | `GOVERNANCE_GO_LIVE_CLOSEOUT_2026-02-18.md` DoD + runbooks |
| Readiness scorecard | Workflow URL + `elite-readiness-report` | `POSEIDON_ELITE_TODO.md` / execution planning |
| Board refresh | Workflow URL + `elite-board-diff` | `ELITE_EXECUTION_BOARD.md` maintenance evidence |
| Release publish approval gate | Environment config screenshot + release workflow run URL + published release URL | Distribution hardening evidence (Founder checklist #8) |
| Release environment drift audit | Monthly audit workflow URL + issue URL + `release-environment-audit-report` artifact + remediation evidence | Distribution hardening evidence (Founder checklist #8) |
| Governance executive snapshot | Monthly snapshot workflow URL + `governance-executive-snapshot` artifact | Governance operations health evidence |
| Governance executive trend | Monthly snapshot workflow URL + `governance-executive-trend` artifact | Governance month-over-month drift evidence |

After capturing all evidence, populate the final ledger in `GOVERNANCE_GO_LIVE_CLOSEOUT_2026-02-18.md` under `Final Completion Record (Fill When Done)`.

## Release Environment Gate Setup (`production-release`)

Use this setup for `.github/workflows/release-distribution-provenance.yml` publish protection.

1. Open GitHub repository `Settings` -> `Environments` -> `New environment`.
2. Create environment name: `production-release`.
3. Configure `Required reviewers` (minimum 1 approver from release owners).
4. Enable `Prevent self-review` for production release approvals.
5. Add environment secret:
   - `POSEIDON_PROVENANCE_SIGNING_PRIVATE_KEY` (required only when signing is enabled in workflow input).
6. Restrict environment branch policy to protected release branches/tags as applicable.
7. Save and verify by running workflow `.github/workflows/release-distribution-provenance.yml` with:
   - `publishToGitHubRelease=true`
   - `enableSigning=true`
   - `releaseEnvironment=production-release`
   - `releaseTag=<new-tag>`

Expected behavior:
- Publish job pauses until environment approval is granted.
- Existing tag publish attempts fail (immutable tag policy).
- Publish attempts with `enableSigning=false` fail by policy.
- Approved run publishes release assets + provenance manifests (+ `.sig` when signing enabled).

## Failure Handling (Best Practice)
- If any strict workflow fails:
  1. Do not mark closeout/launch as complete.
  2. Open or update remediation issue with labels: `governance`, `backend`, and applicable `kpi:*`.
  3. Record owner, due date, and corrective action.
  4. Re-run failed strict workflow and attach final passing evidence.

## Fast Local Verification Commands
- `node scripts/governance/check-go-live-closeout.mjs`
- `node scripts/governance/check-go-live-closeout.mjs --strict`
- `node scripts/governance/check-elite-readiness.mjs`
- `node scripts/governance/check-elite-readiness.mjs --strict --target=elite`
- `node scripts/governance/check-elite-readiness.mjs --strict --target=launch`
- `node scripts/governance/generate-elite-execution-board.mjs`
- `node scripts/governance/generate-governance-executive-snapshot.mjs`
- `node scripts/governance/validate-governance-executive-snapshot.mjs`
- `node scripts/governance/generate-governance-executive-trend.mjs`
- `node scripts/governance/validate-governance-executive-trend.mjs`

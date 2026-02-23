
# Documentation & Runbooks (Poseidon)

## Navigation

- Workflow/configuration source of truth: `ENTERPRISE_LICENSING.md#weekly-issue-workflow`

## Comprehensive Documentation

- Maintain up-to-date README.md, API docs, and onboarding guides.
- Document all admin workflows, security policies, backup/recovery steps, and deployment processes.
- Use Typedoc for automated API documentation.

## Runbooks

- Create runbooks for common incidents: backup restore, disaster recovery, service restart, security breach, failed deploy, audit log review.
- Include step-by-step instructions, escalation contacts, and troubleshooting tips.

## Automated Documentation Checks

- Enforce documentation updates in PRs for new features, workflows, or changes.
- Use CI/CD to check for missing or outdated docs.

## Admin Onboarding

- Provide onboarding guides for new admins, including RBAC, 2FA, audit logging, and error-proof workflows.

## Accessibility & Searchability

- Organize docs for easy navigation and search.
- Use markdown, diagrams, and code samples.

## License Event Severity Response Runbook

Scope note: this section is the source of truth for responder actions and escalation behavior during medium/high license-event incidents.

### Purpose

- Define a consistent incident response flow for weekly license-event severity findings (`low|medium|high`).
- Align automated workflow outcomes with human triage, ownership, and recovery actions.

### Signal Source

- Workflow: `.github/workflows/backend-license-events-weekly-issue.yml`
- Tracking issue: `Security: Backend license event weekly summary`
- Key fields: severity, top reasons, top events, top roles, and run stats.
- See also: `ENTERPRISE_LICENSING.md` (weekly workflow thresholds, fail-gate, and variable precedence).
- Policy source: `governance/policies/license-anomaly-escalation-policy.json` (threshold and escalation defaults).

### Severity Levels

- **Low**
  - Expected baseline behavior; no immediate service risk.
    - Action: review in weekly ops sync, capture trend notes.
- **Medium**
  - Elevated invalid/revoked signals requiring same-day triage.
    - Action: assign owner, verify key distribution/config integrity, review false positives.
- **High**
  - Significant revocation/signature failures or invalid volume spike.

  - Action: immediate on-call response, root-cause investigation, and escalation path execution.

### High-Severity SOP

1. Acknowledge issue and confirm assigned on-call owner.
2. Validate whether failures are real or environmental (clock skew, stale deployment config, malformed transport).
3. Run staging dry-run validation using `license:validate-revocations` for representative keys.
4. Confirm `POSEIDON_LICENSE_SECRET`, revocation hashes, and client key distribution are aligned.
5. If risk is active, keep/enable `warn` fallback where needed while restoring correctness.
6. Record root cause, blast radius, mitigation, and follow-up actions in the weekly issue.

### Escalation & Ownership

- Configure `LICENSE_ALERT_ASSIGNEES` to on-call usernames for automatic assignment.
- For strict enforcement posture, set `LICENSE_FAIL_ON_HIGH=true` after rollout readiness is met.
- Manual dispatch inputs override repository-variable defaults; repository variables override policy defaults.

### Recovery Exit Criteria

- High/medium issue has identified owner and documented root cause.
- Corrective action verified in staging and reflected in production config.
- Two consecutive reporting cycles show no unexpected high severity.
- Outstanding follow-up tasks are tracked in issue/roadmap with due dates.

pnpm --filter backend run liveops:license:strict-staging

### Strict-mode staging enablement evidence (`LIC-02`)

Before changing `POSEIDON_LICENSE_ENFORCEMENT` from `warn` to `strict` in staging, run:

```sh
pnpm --filter backend run liveops:license:strict-staging
```


Expected outputs:

- smoke checks confirm missing/invalid/revoked blocked and valid key allowed
- endurance check meets policy threshold (`successRate` and `failureCount`)

Policy + workflow references:

- `governance/policies/license-strict-staging-rollout-policy.json`
- `.github/workflows/backend-license-strict-staging-gate.yml`


## Database Naming Migration Change Ticket Template

Scope note: use this template for any production change that updates `POSEIDON_DB_NAME`, `DATABASE_URL`, or both.

- Change owner:
- Approver:
- Planned change window (UTC):
- Environment(s):
- Current DB identifier / target DB identifier:
- Backup completed and restore test evidence link:
- Staging validation evidence link:
- Rollback command/config and prior known-good values:
- Post-change verification checks (health, migrations, app connectivity):
- Outcome and follow-up actions:

## Branch Protection Audit Log (Monthly)

Scope note: record each monthly (or post-major-change) branch protection audit referenced in `SECURITY.md`.

- Automation source: `.github/workflows/backend-branch-protection-audit-monthly-issue.yml`
- Tracking issue title: `Security: Monthly branch protection audit`
- Drift guard enforcement: root CI step `Validate branch protection audit template governance` (`node scripts/governance/check-branch-protection-audit-template.mjs`)
- KPI label default enforcement: CI drift guard verifies `kpi:legal-drift-review` is present in `backend/scripts/stress/bootstrap-github-labels.ts`

| Audit date (UTC) | Auditor | Branch/ruleset scope | Checks verified | Gaps found | Remediation owner | Target completion date | Evidence link |
| --- | --- | --- | --- | --- | --- | --- | --- |
| YYYY-MM-DD | @kuhna | main | CI / build-and-test; CI / legal-release-record-check; Governance Dry Run / governance-dry-run; Backend Docs Link Check / docs-link-check; Backend DB Change Evidence Check / evidence-check | None | N/A | N/A | Link to issue/change record |

-Audit control checklist (record Yes/No and evidence each month):

- Require branches to be up to date before merging: Yes/No
- Require pull request reviews + dismiss stale approvals: Yes/No
- Require conversation resolution before merging: Yes/No
- Restrict who can push to matching branches (maintainers only): Yes/No

### Monthly Audit Issue Comment Template

Copy into the monthly issue (`Security: Monthly branch protection audit`) and complete all fields:

```markdown
## Audit Evidence (YYYY-MM)

- Audit date (UTC): YYYY-MM-DD
- Auditor: @username
- Branch/ruleset scope: main
- Evidence links: <PR / screenshot / settings export / run URL>

### Required checks on `main`
- [ ] `CI / build-and-test` — Evidence:
- [ ] `CI / legal-release-record-check` — Evidence:
- [ ] `Governance Dry Run / governance-dry-run` — Evidence:
- [ ] `Backend Docs Link Check / docs-link-check` — Evidence:
- [ ] `Backend DB Change Evidence Check / evidence-check` — Evidence:

### Branch protection controls
- [ ] Require branches to be up to date before merging — Evidence:
- [ ] Require pull request reviews + dismiss stale approvals — Evidence:
- [ ] Require conversation resolution before merging — Evidence:
- [ ] Restrict who can push to matching branches (maintainers only) — Evidence:

### Findings and remediation
- Gaps found: None / <describe>
- Remediation owner: N/A / @username
- Target completion date: N/A / YYYY-MM-DD
- Tracking issue(s): <link(s)>

### Runbook log update
- [ ] Added/updated Branch Protection Audit Log row in `backend/DOCUMENTATION_RUNBOOKS.md`
```


## Documentation Freshness Review Log (Quarterly)

Scope note: record each quarterly policy/runbook freshness review for `SECURITY.md`, `ONBOARDING.md`, and this runbook.

- Automation source: `.github/workflows/backend-docs-freshness-quarterly-issue.yml`
- Tracking issue title: `Docs: Quarterly backend policy/runbook freshness review`

| Review quarter | Review date (UTC) | Reviewer | Files reviewed | Updates required | Evidence link |
| --- | --- | --- | --- | --- | --- |
| YYYY-QX | YYYY-MM-DD | @owner | SECURITY.md; ONBOARDING.md; DOCUMENTATION_RUNBOOKS.md | None | Link to issue/PR |
| 2026-Q1 | 2026-02-18 | @kuhna | SECURITY.md; ONBOARDING.md; DOCUMENTATION_RUNBOOKS.md; GOVERNANCE_CONTROLS_MATRIX.md | Governance dry-run required check and matrix governance controls synchronized | [GOVERNANCE_GO_LIVE_CLOSEOUT_2026-02-18.md](../GOVERNANCE_GO_LIVE_CLOSEOUT_2026-02-18.md) |


### Repository Variable Audit Checklist (Quarterly)

Record variable audit evidence each quarter (or when governance ownership changes):

- `BRANCH_PROTECTION_AUDIT_ASSIGNEES`: present, current owners, no stale usernames
- `DOCS_REVIEW_ASSIGNEES`: present, current owners, no stale usernames
- `LEGAL_REVIEW_ASSIGNEES`: present, current owners, no stale usernames
- `LICENSE_ALERT_ASSIGNEES`: aligned to current incident responders
- `LICENSE_FAIL_ON_HIGH`: value matches current risk policy (`true`/`false` decision documented)
- `POSEIDON_DB_NAME`: aligned with production naming policy and deployment configs

Evidence targets:

- Quarterly docs freshness issue comments and linked PRs
- `GOVERNANCE_CONTROLS_MATRIX.md` updates when ownership or automation mapping changes



## Governance Closeout Strict Workflow Runbook

Scope note: run strict closeout enforcement from `.github/workflows/governance-closeout-strict.yml` after each external governance action to keep go-live evidence current.


### Execution Cadence

- Run after updating branch protection rules on `main`.
- Run after label bootstrap apply execution.
- Run after manual governance dry-run dispatch/artifact capture.
- Run after legal counsel/status updates that affect closeout action 5.


### Operator Procedure

1. Open GitHub Actions and run workflow `Governance Closeout Strict` on default branch.
2. Wait for completion and open the step summary.
3. Download artifact `governance-closeout-report`.
4. Copy workflow URL and artifact reference into `GOVERNANCE_GO_LIVE_CLOSEOUT_2026-02-18.md` evidence links.
5. If failed, resolve listed strict failures, update evidence links, then re-run until pass.


### Required Evidence

- Workflow run URL (`Governance Closeout Strict`).
- Artifact reference for `governance-closeout-report`.
- Updated evidence links in `GOVERNANCE_GO_LIVE_CLOSEOUT_2026-02-18.md`.


### Failure Handling

- Treat strict failure as governance gate not met; do not mark closeout complete.
- Open or update a remediation issue with labels `governance`, `backend`, and the appropriate KPI label.
- Record owner, due date, and corrective action in issue comments.

## Governance KPI Drift Response

Scope note: use this procedure when a governance KPI target in `README.md` is missed (monthly audit, quarterly freshness review, or required governance checks).

### Trigger Conditions

- Monthly branch protection audit issue is not completed in the expected month.
- Quarterly docs freshness issue is not completed in the expected quarter.
- Backend PR merged without required governance gate evidence/checks.

### Issue Label and Severity Standard

- Required labels for all governance exception remediation issues:

  - `governance`
  - `backend`
  - `security`
- Severity mapping:
  - `severity:high` — Required governance gate bypassed or merged without mandatory checks/evidence.
  - `severity:medium` — Monthly or quarterly governance task missed but caught before next cycle closes.
  - `severity:low` — Documentation/reporting lag with no control bypass.
- Include a `kpi:<name>` label where possible (example: `kpi:branch-protection-audit`, `kpi:docs-freshness`).

### Response Steps

1. Open a remediation issue within 1 business day and label it `governance` + `backend`.
2. Assign an owner and target completion date.
3. Perform catch-up execution (run missed audit/review and record evidence links).
4. Document root cause (ownership gap, workflow failure, process gap, or emergency exception).
5. Add corrective action (automation tweak, checklist update, or owner rotation) with due date.


### Exit Criteria

- Missed KPI artifact is completed and linked in the relevant log table.
- Root cause and corrective action are documented.
- Follow-up owner and due date are visible in issue tracking.

---

## Next Steps


 - Enforce 100% test coverage for all critical modules in every app (web, admin-dashboard, admin-panel, mobile, poseidon-studio, poseidon-ui, backend).
 - Add and maintain advanced unit, integration, and e2e tests for every app.
 - Run linting and formatting checks on every commit and PR across all apps.
 - Ensure CI runs all tests, coverage, and linting before merge for every app.

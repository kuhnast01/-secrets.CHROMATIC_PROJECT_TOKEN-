# Security Policy for Poseidon

- Last reviewed: 2026-02-18

## Supported Versions

- Only the latest major version is actively supported.

## Reporting a Vulnerability

- Please report security issues privately via email to the maintainers.
- Do not open public issues for security vulnerabilities.

## Access Control

- All sensitive actions require code review and approval.
- Use branch protection rules on `main` and release branches.
- Enable required status checks for CI, lint, and tests before merging.
- Use CODEOWNERS to enforce review from core maintainers.
- Ownership authority: Daniel Kuhnast (Poseidon Engine, GitHub `@kuhna`).

## Required CI Gates

- Configure branch protection to require status checks before merge.
- Minimum required checks for backend changes:
	  - `CI / build-and-test` (from `backend/.github/workflows/ci.yml`)
	  - `CI / legal-release-record-check` (from `.github/workflows/ci.yml` via reusable `.github/workflows/legal-release-record-check.yml`)
	  - `Governance Dry Run / governance-dry-run` (from `.github/workflows/governance-dry-run.yml`)
	  - `Backend Docs Link Check / docs-link-check` (from `.github/workflows/backend-doc-links-check.yml`)
	  - `Backend DB Change Evidence Check / evidence-check` (from `.github/workflows/backend-db-change-evidence-check.yml`)
- Keep "Require branches to be up to date before merging" enabled.
- Keep "Require pull request reviews" and "Dismiss stale approvals" enabled.
- Keep "Require conversation resolution before merging" enabled.
- Restrict push access on protected branches to maintainers only.

## Branch Protection Audit Cadence

- Audit branch protection settings monthly (or immediately after major workflow/security changes).
- Audit owner: Daniel Kuhnast (`@kuhna`) or designated maintainer delegate.
- Verify required checks, review requirements, and stale-approval dismissal are still enforced.
- Scheduled audit automation: `.github/workflows/backend-branch-protection-audit-monthly-issue.yml`.
- Record audit date, auditor, and any remediation actions in change/operations records.

## Repository Variables Governance

- Scope: `POSEIDON_DB_NAME`, `LICENSE_FAIL_ON_HIGH`, `LICENSE_ALERT_ASSIGNEES`, `BRANCH_PROTECTION_AUDIT_ASSIGNEES`, `DOCS_REVIEW_ASSIGNEES`.
- Change owner: Daniel Kuhnast (`@kuhna`) or designated maintainer delegate.
- Require PR-based documentation updates when variable behavior/intent changes.
- Treat variable updates that impact production behavior as controlled changes with rollback notes.
- Verify variable values during monthly branch protection/security governance audit.
- Governance exceptions or missed KPI targets must follow `Governance KPI Drift Response` in `DOCUMENTATION_RUNBOOKS.md`.

## Backups

- All critical data and configuration should be backed up regularly.
- Use cloud provider backup solutions for production data.
- Store infrastructure and configuration as code in version control.

## Database Naming Change Control

- Treat database identifier changes (`POSEIDON_DB_NAME`, `DATABASE_URL`) as controlled production changes.
- Require staged validation before production rollout.
- Require successful backup and restore verification before cutover.
- Require rollback plan with prior known-good DB name and connection string.
- Log change window, approver, and outcome in incident/change records.

---

## Maintenance

- Keep this policy up to date as security practices evolve.
- Keep this policy up to date as security practices evolve.

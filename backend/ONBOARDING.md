# Onboarding Guide: Poseidon Backend

- Last reviewed: 2026-02-18


## Quick Start

1. Clone the repo and open in VS Code.
2. Copy `.env.example` to `.env` and update credentials as needed.
3. Run `docker-compose up` to start backend and database.
4. Visit `http://localhost:4000/api-docs` for API documentation.
5. Run `pnpm test` to verify everything works.


## Key Features

- TypeScript, Express, Prisma, PostgreSQL
- Dockerized for easy local/cloud setup
- Automated tests and CI
- Swagger UI for API docs
- Localization (i18n) and multi-region support
- Security best practices (helmet, rate limiting, audit logging)
- Health check endpoint for cloud scaling


## Useful Scripts

- `pnpm run dev` — Start backend in dev mode
- `pnpm exec prisma migrate dev` — Run DB migrations
- `pnpm exec ts-node prisma/seed.ts` — Seed the database
- `pnpm test` — Run all tests
- `pnpm exec tsx scripts/docs/check-markdown-links.ts` — Validate backend markdown links/anchors


## Branch Protection Setup (Maintainers)

1. Open GitHub repository settings for the default branch (`main`).
2. Enable branch protection and require pull request reviews.
3. Enable "Require branches to be up to date before merging".
4. Add required status checks:
	- `CI / build-and-test`
	- `CI / legal-release-record-check`
	- `Governance Dry Run / governance-dry-run`
	- `Backend Docs Link Check / docs-link-check`
	- `Backend DB Change Evidence Check / evidence-check`
5. Enable "Dismiss stale pull request approvals when new commits are pushed".
6. Save rules and validate by opening a test PR that touches `backend/**/*.md`.

### Branch Protection UI Checklist (GitHub)
1. Go to **GitHub → Settings → Branches → Branch protection rules**.
2. Create or edit the rule for `main`.
3. Under **Protect matching branches**, enable:
	- Require a pull request before merging
	- Require approvals (minimum: 1)
	- Require conversation resolution before merging
	- Dismiss stale pull request approvals when new commits are pushed
	- Require status checks to pass before merging
	- Require branches to be up to date before merging
	- Restrict who can push to matching branches (maintainers only)
4. In required checks, select exactly:
	- `build-and-test`
	- `legal-release-record-check`
	- `governance-dry-run`
	- `docs-link-check`
	- `evidence-check`
5. Save changes and verify on a PR that all required checks appear and block merge when failing.

### Required Checks Baseline

| Check | When it should run | Purpose |
| --- | --- | --- |
| `CI / build-and-test` | Backend code/config changes | Build, type, test, and quality gate |
| `CI / legal-release-record-check` | PR/push runs on `main` via root CI | Enforce legal release record schema/completeness |
| `Governance Dry Run / governance-dry-run` | Every PR/push on `main` | Consolidated governance checker suite and unified evidence artifact |
| `Backend Docs Link Check / docs-link-check` | Backend markdown/docs tooling changes | Validate markdown links/anchors |
| `Backend DB Change Evidence Check / evidence-check` | PRs with `POSEIDON_DB_NAME`/`DATABASE_URL` impact | Enforce change-ticket and rollback evidence in PR body |

### Ownership
- Primary code owner: Daniel Kuhnast
- GitHub owner handle: `@kuhna`
- Studio: Poseidon Engine
- Ownership enforcement source: `.github/CODEOWNERS` and `backend/.github/CODEOWNERS`

### Validation Checklist
- Required checks appear in PR status and block merge when failing.
- Docs-only PR triggers `Backend Docs Link Check / docs-link-check`.
- Backend code PR triggers `CI / build-and-test`.
- Branch protection includes `CI / legal-release-record-check`.
- Branch protection includes `Governance Dry Run / governance-dry-run`.
- DB identifier PRs trigger `Backend DB Change Evidence Check / evidence-check`.
- No direct pushes to `main` outside approved emergency process.

### Monthly Audit Automation Setup
- Workflow: `.github/workflows/backend-branch-protection-audit-monthly-issue.yml`.
- Set repository variable `BRANCH_PROTECTION_AUDIT_ASSIGNEES` to comma-separated GitHub usernames (example: `kuhna,maintainer2`).
- For one-off manual runs, use workflow dispatch input `auditAssignees` to override repository variable for that run only.
- Verify issue title `Security: Monthly branch protection audit` is auto-created/updated on default branch.

### Governance Workflow Smoke Test (Manual Dispatch)
- Prerequisite: GitHub CLI (`gh`) authenticated with workflow permissions (`gh auth status`).
- Run from repository root to validate dispatch wiring during setup:

```bash
gh workflow run backend-branch-protection-audit-monthly-issue.yml --ref main -f auditAssignees=kuhna
gh workflow run backend-docs-freshness-quarterly-issue.yml --ref main -f docsReviewAssignees=kuhna
```

- Confirm both workflows complete successfully and each updates/creates its tracking issue.

### Repository Variables Baseline

| Variable | Used by | Default/Fallback | Required | Purpose |
| --- | --- | --- | --- | --- |
| `POSEIDON_DB_NAME` | `backend/.github/workflows/ci.yml`, `.github/workflows/backend-nightly-stress.yml`, `.github/workflows/backend-weekly-reliability.yml` | `liveops` | Recommended | Keeps DB identifier consistent across CI/stress workflows |
| `LICENSE_FAIL_ON_HIGH` | `.github/workflows/backend-license-events-weekly-issue.yml` | `false` | Optional | Enables fail-gate when weekly license severity is high |
| `LICENSE_ALERT_ASSIGNEES` | `.github/workflows/backend-license-events-weekly-issue.yml` | empty | Optional | Auto-assigns high-severity weekly license issues |
| `BRANCH_PROTECTION_AUDIT_ASSIGNEES` | `.github/workflows/backend-branch-protection-audit-monthly-issue.yml` | empty | Recommended | Auto-assigns monthly branch protection audit issue |
| `DOCS_REVIEW_ASSIGNEES` | `.github/workflows/backend-docs-freshness-quarterly-issue.yml` | empty | Recommended | Auto-assigns quarterly docs freshness review issue |

- Store sensitive values in GitHub Secrets; repository variables here are non-secret operational controls.

## Database Naming Migration (Best Practice)

### Goal
- Standardize database naming via `POSEIDON_DB_NAME` while preserving backward compatibility.

### Safe Rollout Sequence
1. Keep current database name (`liveops`) as baseline.
2. Set repository/environment variable `POSEIDON_DB_NAME` per environment.
3. Ensure `DATABASE_URL` values match the selected DB name in each environment.
4. Run migrations and smoke tests in staging.
5. Promote to production during a change window with rollback readiness.

### Verification Checklist
- `POSTGRES_DB` and `DATABASE_URL` point to the same DB name.
- CI workflows (`CI`, nightly stress, weekly reliability) pass with the configured name.
- Backup/restore drill succeeds for the configured database.
- Application health and auth/licensing routes remain green post-change.

### Rollback
- Revert `POSEIDON_DB_NAME` to previous known-good value.
- Revert `DATABASE_URL` to prior connection string.
- Re-run health checks and targeted smoke tests.

## Where to Find Things
- `src/` — Main backend code
- `src/routes/` — API routes
- `src/controllers/` — Business logic
- `src/models/` — Database access
- `src/middleware/` — Security, i18n, etc.
- `locales/` — Translation files
- `tests/` — Automated tests

## Need Help?
- See `README_DEV_AUTOMATION.md` and `README_CLOUD.md` for more details
- Ask your team or open an issue in the repo

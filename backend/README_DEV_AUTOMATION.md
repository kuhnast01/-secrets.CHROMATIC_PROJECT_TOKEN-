# Developer Automation & Best Practices

- Use `docker-compose up` to start backend + database in one command.
- Use `.env.example` to share config with your team.
- Run `pnpm test` to run all tests (see tests/ folder for examples).
- Use `pnpm run docs:check-links` to validate backend markdown links and anchors.
- DB identifier changes (`POSEIDON_DB_NAME` / `DATABASE_URL`) must include PR evidence links (change ticket, staging validation, backup/restore test, rollback plan) to satisfy `.github/workflows/backend-db-change-evidence-check.yml`.
- Monthly audit issue automation uses `.github/workflows/backend-branch-protection-audit-monthly-issue.yml`; configure `BRANCH_PROTECTION_AUDIT_ASSIGNEES` repository variable (comma-separated usernames), or pass `auditAssignees` when manually dispatching.
- Quarterly docs freshness issue automation uses `.github/workflows/backend-docs-freshness-quarterly-issue.yml`; configure `DOCS_REVIEW_ASSIGNEES` repository variable, or pass `docsReviewAssignees` when manually dispatching.
- Use pre-commit hooks (husky, lint-staged) to keep code clean.
- Use `pnpm exec ts-node prisma/seed.ts` to seed the database.
- All config/secrets should be in `.env` (never hardcoded).
- See Swagger UI at `/api-docs` for live API docs.

## Repository Variables Quick Reference

| Variable | Used by | Default/Fallback | Purpose |
| --- | --- | --- | --- |
| `POSEIDON_DB_NAME` | Backend CI + stress workflows | `liveops` | Keeps database identifier aligned across automated runs |
| `LICENSE_FAIL_ON_HIGH` | Weekly license events workflow | `false` | Enables failure gate when severity is high |
| `LICENSE_ALERT_ASSIGNEES` | Weekly license events workflow | empty | Auto-assigns high-severity license issues |
| `BRANCH_PROTECTION_AUDIT_ASSIGNEES` | Monthly branch protection audit workflow | empty | Auto-assigns monthly branch protection audit issues |
| `DOCS_REVIEW_ASSIGNEES` | Quarterly docs freshness workflow | empty | Auto-assigns quarterly docs freshness issues |

- Keep secrets in GitHub Secrets; use repository variables for non-secret operational controls.

## Governance Workflow Smoke Test Commands

- Prerequisite: GitHub CLI (`gh`) authenticated with workflow permissions (`gh auth status`).
- Run from repository root:

```bash
gh workflow run backend-branch-protection-audit-monthly-issue.yml --ref main -f auditAssignees=kuhna
gh workflow run backend-docs-freshness-quarterly-issue.yml --ref main -f docsReviewAssignees=kuhna
```

- Confirm both workflow runs complete and update/create their tracking issues.

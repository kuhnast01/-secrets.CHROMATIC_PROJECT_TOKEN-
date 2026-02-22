# FrontendMonorepo

![CI](https://github.com/Poseidon-Engine/FrontendMonorepo/actions/workflows/ci.yml/badge.svg)
![Coverage](https://img.shields.io/badge/coverage-80%25-brightgreen)
![Lint](https://img.shields.io/badge/lint-passing-brightgreen)


## Overview

This monorepo contains all frontend applications and shared packages for the SIMgame platform, including web, mobile, and admin tools. It uses pnpm workspaces, TypeScript, React, and modern tooling for scalable, maintainable development.



- **Full dependency visibility (dev + prod):**

   ```sh
   pnpm run audit:all
   ```

- Use `audit:prod` as the required pre-PR check for dependency updates.
- Use `audit:all` to monitor dev-tooling advisories that are tracked separately in CI.


## Backend Governance Index

- Governance overview: [backend/README.md](backend/README.md)
- Branch protection policy-as-code: [governance/policies/branch-protection-policy.json](governance/policies/branch-protection-policy.json)
- Elite readiness policy-as-code: [governance/policies/elite-readiness-policy.json](governance/policies/elite-readiness-policy.json)
- Automation operator guide: [backend/README_DEV_AUTOMATION.md](backend/README_DEV_AUTOMATION.md)
- Governance operator runbook: [GOVERNANCE_OPERATOR_RUNBOOK.md](GOVERNANCE_OPERATOR_RUNBOOK.md)
- Elite execution board: [ELITE_EXECUTION_BOARD.md](ELITE_EXECUTION_BOARD.md)
- Active governance workflows:

   - [.github/workflows/backend-db-change-evidence-check.yml](.github/workflows/backend-db-change-evidence-check.yml)
   - [.github/workflows/backend-branch-protection-audit-monthly-issue.yml](.github/workflows/backend-branch-protection-audit-monthly-issue.yml)
   - [.github/workflows/backend-docs-freshness-quarterly-issue.yml](.github/workflows/backend-docs-freshness-quarterly-issue.yml)
   - [.github/workflows/legal-release-record-check.yml](.github/workflows/legal-release-record-check.yml)
   - [.github/workflows/legal-template-drift-quarterly-issue.yml](.github/workflows/legal-template-drift-quarterly-issue.yml)
   - [.github/workflows/governance-dry-run.yml](.github/workflows/governance-dry-run.yml)
   - [.github/workflows/governance-closeout-strict.yml](.github/workflows/governance-closeout-strict.yml)
   - [.github/workflows/elite-readiness-scorecard.yml](.github/workflows/elite-readiness-scorecard.yml)
   - [.github/workflows/elite-board-refresh.yml](.github/workflows/elite-board-refresh.yml)

- Adversarial governance break test command: `node scripts/governance/run-adversarial-break-tests.mjs`

## Governance Issue Intake

- Issue intake is template-driven (`.github/ISSUE_TEMPLATE/config.yml`), and blank issues are disabled to preserve auditability.
- Use the governance rollout template for policy/CI/evidence implementation work: `.github/ISSUE_TEMPLATE/governance_rollout_checklist.md`.
- Security vulnerabilities should be reported privately via GitHub Security Advisories.

## Development Guidelines

### Module Boundaries

- See [AI_AUTOMATION.md](AI_AUTOMATION.md) for details on AI and automation usage in this project.
- Run E2E tests from the `e2e/` folder.
- Run accessibility tests with Jest + jest-axe: `pnpm exec jest --testPathPattern=a11y`
- Run visual regression tests with Storybook/Chromatic: `pnpm chromatic --project-token=<your-token>`


## Contributing

## Feedback and Workflow Iteration

See [FEEDBACK.md](FEEDBACK.md) for feedback channels and workflow iteration process.

- [apps/web/README.md](apps/web/README.md)
- [apps/mobile/README.md](apps/mobile/README.md)
- [apps/admin-dashboard/README.md](apps/admin-dashboard/README.md)
- [apps/admin-panel/README.md](apps/admin-panel/README.md)
- [packages/api/README.md](packages/api/README.md)
- [packages/models/README.md](packages/models/README.md)
- [packages/ui/README.md](packages/ui/README.md)

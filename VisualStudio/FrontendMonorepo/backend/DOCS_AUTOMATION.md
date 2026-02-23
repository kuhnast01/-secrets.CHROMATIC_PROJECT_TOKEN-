# Documentation Automation for Poseidon

## Backend Automation, Maintenance, and Troubleshooting Guide

## Admin Automation, Overrides, and Troubleshooting

### Admin-Only Endpoints

- All sensitive actions (grants, refunds, store edits, dynamic offers) are only accessible via `/api/admin/*` endpoints.
- Endpoints require admin authentication and multi-factor authentication (MFA).
- All actions are logged via the audit logger.

### Automated, Audited Admin Actions

- Every admin action triggers an audit log with user, action, before/after state, and timestamp.
- Use the script `node backend/scripts/admin-action-log-summary.js` to summarize recent admin actions.

### Safe Automation with Admin Overrides

- Automation runs by default, but admins can override or approve exceptions with justification (all overrides logged).
- Use the dry run script `node backend/scripts/admin-action-dryrun.js <action> <payload.json>` to preview changes before applying.

### Self-Documenting Actions

- Every admin action generates a summary and attaches it to the audit log.
- Optionally, notify a Slack/email channel for transparency (future integration).

### Automated Alerts & Rollbacks

- Automation detects anomalies and alerts admins.
- Admins have one-click rollback/remediation tools (see `backend/scripts/admin-maintenance-tools.md`).

### Scripted Maintenance & Recovery

- One-click scripts for maintenance (rebuild indexes, revalidate store, re-run tests, restore backups) are documented in `backend/scripts/admin-maintenance-tools.md`.
- All results are logged and visible in the admin dashboard.

### Documentation & SOPs

- All automation, override, and troubleshooting procedures are documented here and in `admin-maintenance-tools.md`.

---

## Automated Scripts & Pipelines

### Store Item Schema Validation

- **Script:** `node backend/scripts/validate-store-items-schema.ts`
- **Purpose:** Validates all `backend/store_items/*.json` files against a strict schema for correctness.
- **Run:** `pnpm run validate:store-items`
- **CI:** Integrate this script in your CI pipeline to block invalid store items.

### Purchase Endpoint Tests

- **Script:** `jest tests/shop.test.ts`
- **Purpose:** Automated tests for `/api/shop/purchase` endpoint (valid/invalid receipts, entitlement grant, transaction logging).
- **Run:** `pnpm run test:shop`
- **CI:** Should be run on every backend change.

### Full Test Suite

- **Script:** `jest`
- **Purpose:** Runs all backend tests.
- **Run:** `pnpm run test`

### Audit & Transaction Logging

- **Location:** `backend/src/middleware/auditLogger.ts`, `backend/src/services/purchaseService.ts`
- **Purpose:** All sensitive actions and purchases are logged for audit and compliance.
- **Check:** Review logs in DB or console for troubleshooting.

### LiveOps & Stress Testing

- **Scripts:**
  - `pnpm run liveops:event:pipeline` — Event pipeline automation
  - `pnpm run stress:smoke` — Smoke test
  - `pnpm run stress:spike` — Spike test
  - `pnpm run stress:soak` — Soak test
- **Purpose:** Automate event, regression, and stress testing for reliability.

### License & Security Automation

- **Scripts:**
  - `pnpm run license:generate` — Generate license keys
  - `pnpm run license:validate-revocations` — Validate license revocations
  - `pnpm run liveops:license:revocation-rotation` — Drill for license revocation/rotation

## Troubleshooting Checklist

- **Schema validation fails:** Check error output for which store item JSON is invalid. Fix and re-run.
- **Purchase endpoint fails:** Run `pnpm run test:shop` and check logs for errors.
- **Audit logs missing:** Ensure `auditLogger` middleware is enabled in `backend/src/index.ts`.
- **LiveOps/stress tests fail:** Review test output and logs. Check for resource or config issues.
- **License errors:** Ensure secrets are set and license scripts are run as documented.

## Maintenance Best Practices

- Keep all automation scripts up to date and versioned.
- Document every new script or automation in this file.
- Integrate all critical scripts into CI/CD pipelines.
- Regularly review audit and transaction logs for anomalies.
- Use schema validation and automated tests as gates for all production deployments.

---

For more details, see:

- `backend/store_items/README.md` — Store item schema and safety
- `backend/AUDIT_LOGGING_PLAN.md` — Audit logging plan
- `backend/SECURITY.md` — Security practices
- `backend/POSEIDON_ELITE_TODO.md` — Elite automation backlog

## API Documentation

- All TypeScript types and API contracts are documented in `src/types` and `src/models`.
- To generate API docs, run:

  ```sh
  npx typedoc --out docs/api src/
  ```

- Generated docs are output to `docs/api`.

## Keeping Docs Up to Date

- All new features and endpoints must include documentation updates.
- PRs are checked for missing or outdated docs.
- Docs are published automatically with each release.

## Contributing

- See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on writing and updating documentation.

---

_This file is generated and updated automatically. Do not edit directly._

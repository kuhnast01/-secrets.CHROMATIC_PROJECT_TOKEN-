# Admin Maintenance & Recovery Tools

## One-Click Scripts

### Rebuild Indexes
- **Script:** `pnpm exec prisma migrate dev --name rebuild-indexes`
- **Purpose:** Rebuild DB indexes for performance and integrity.

### Revalidate Store
- **Script:** `pnpm run validate:store-items`
- **Purpose:** Re-run schema validation on all store items.

### Re-run Tests
- **Script:** `pnpm run test`
- **Purpose:** Run all backend tests for health check.

### Restore Backups
- **Script:** `node backend/scripts/restore-backup.js <backup-file>`
- **Purpose:** Restore DB or store state from backup file.

## Usage
- All scripts log actions and results to the audit log for traceability.
- Results are visible in the Admin dashboard and can be exported for compliance.

## Troubleshooting
- If a script fails, check the audit log and error output for details.
- For critical failures, contact engineering support and provide the log summary.

---

Keep this file updated as new tools/scripts are added.

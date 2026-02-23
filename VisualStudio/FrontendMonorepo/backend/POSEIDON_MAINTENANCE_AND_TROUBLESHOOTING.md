# Poseidon Platform Maintenance & Troubleshooting Guide

## Routine Maintenance Checklist

- **Update dependencies:**
  - Run `pnpm update -r` weekly.
  - Review and resolve any security advisories with `pnpm audit:all`.
- **Run full test suite:**
  - `pnpm test` (from monorepo root)
  - Review and address any failures.
- **Lint and format:**
  - `pnpm lint` and `pnpm format`.
- **Backup critical data:**
  - Verify backup jobs and retention in your cloud provider or on-premise system.
  - **Monitor system health:**
    - Run `pnpm exec node backend/scripts/health/check-health.js` for automated health checks.
    - Check `/healthz` and `/system-health` endpoints manually if needed.
    - Review logs and alerts in your monitoring dashboard.

## Troubleshooting Common Issues

### Backend Fails Health Check

- Ensure the backend is running: `pnpm --filter backend run dev`
- Check logs for errors: `pnpm --filter backend run dev` and review output.
- Verify environment variables (e.g., `DATABASE_URL`, `POSEIDON_LICENSE_SECRET`).
- Confirm database is reachable and migrations are up to date: `pnpm --filter backend run build && pnpm --filter backend run migrate`.

### Stress Test Fails

- Ensure backend is healthy before running stress: `/healthz` endpoint should return 200.
- Run stress test directly: `pnpm exec tsx backend/scripts/stress/run-autocannon.ts smoke`
- Review logs for resource exhaustion or errors.
- Check system resource usage (CPU, memory, disk, network).

### CI/CD Pipeline Fails

- Review the failed job logs in GitHub Actions or your CI provider.
- Ensure all required secrets and environment variables are set.
- Run tests and lint locally to reproduce issues.

## Best Practices
- Always run tests and lint before pushing changes.
- Keep dependencies up to date and monitor for vulnerabilities.
- Document any manual fixes or workarounds in this file for future maintainers.
- Use the provided scripts and checklists for all routine operations.

---

_Last updated: 2026-02-20_

# Sprint 8: Deployment, Monitoring, and CI/CD for Poseidon

## Deployment

### Local

- Run `pnpm install` in the root and backend directories.
- Start the backend: `pnpm dev` or `pnpm start` in `backend/`.

### Staging/Production

- Use Docker: `docker build -t poseidon-backend .` and `docker run -p 4000:4000 poseidon-backend`.
- Or deploy to cloud (e.g., Azure, AWS, GCP) using the provided Dockerfile and docker-compose.yml.

## Monitoring

- Health check endpoint: `GET /healthz` (returns 200 if healthy)
- Add monitoring integration (e.g., Prometheus, Grafana, Datadog) as needed.

## CI/CD

- GitHub Actions workflow in `.github/workflows/ci.yml`:
  - Install dependencies
  - Run lint and tests
  - Build Docker image
  - Optionally deploy to staging/production

## Database Naming Migration Pre-Flight (Production)

- Change owner and approver identified.
- Change window approved and logged.
- `POSEIDON_DB_NAME` and `DATABASE_URL` target values reviewed.
- Backup completed with restore-test evidence attached.
- Staging validation evidence attached.
- Rollback values/commands prepared and verified.
- Post-change checks defined (`/healthz`, migrations, app connectivity).

## Example GitHub Actions Workflow

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - name: Install dependencies
        run: pnpm install
      - name: Lint
        run: pnpm lint || true
      - name: Test
        run: pnpm test
      - name: Build Docker image
        run: docker build -t poseidon-backend ./backend
```

## Notes

- Ensure environment variables are set for production deployments.
- Use secrets for sensitive data in CI/CD.
- For database naming updates, treat `POSEIDON_DB_NAME`/`DATABASE_URL` changes as controlled changes and complete the change ticket template in `DOCUMENTATION_RUNBOOKS.md` before production rollout.
- Follow rollout and rollback criteria in `ONBOARDING.md` and `SECURITY.md` during the production change window.
- Extend monitoring and alerting as needed for your stack.

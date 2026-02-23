# Backend Documentation

See [SECURITY.md](SECURITY.md) for security, access control, and backup policy.

## Documentation Automation

See [DOCS_AUTOMATION.md](DOCS_AUTOMATION.md) for API and code documentation automation details.

## Governance Automation Status

### Governance Controls


![DB Evidence Gate](https://img.shields.io/badge/Governance-DB%20Evidence%20Gate-blue)
![Monthly Branch Audit](https://img.shields.io/badge/Governance-Monthly%20Branch%20Audit-blue)
![Quarterly Docs Review](https://img.shields.io/badge/Governance-Quarterly%20Docs%20Review-blue)

- Security policy and gate ownership: [SECURITY.md](SECURITY.md)
- Operational setup and smoke-test commands: [README_DEV_AUTOMATION.md](README_DEV_AUTOMATION.md)
- Governance templates and audit logs: [DOCUMENTATION_RUNBOOKS.md](DOCUMENTATION_RUNBOOKS.md)
- Maintainer setup and variables baseline: [ONBOARDING.md](ONBOARDING.md)

### Governance KPIs

| KPI | Target cadence | Pass criteria | Source of evidence |
| --- | --- | --- | --- |
| Branch protection audit completion | Monthly | `Security: Monthly branch protection audit` issue updated/closed with audit log entry | `DOCUMENTATION_RUNBOOKS.md` Branch Protection Audit Log |
| Policy/runbook freshness review | Quarterly | `Docs: Quarterly backend policy/runbook freshness review` issue completed with documented outcomes | `DOCUMENTATION_RUNBOOKS.md` Documentation Freshness Review Log |
| DB identifier change control adherence | Per PR touching DB identifiers | PR includes required evidence fields and passes DB evidence check workflow | `.github/workflows/backend-db-change-evidence-check.yml` run status |
| Required CI governance gates | Every backend PR | `CI / build-and-test`, `CI / legal-release-record-check`, `Governance Dry Run / governance-dry-run`, docs-link check, and DB evidence check all green before merge | Branch protection checks on `main` |

- KPI misses: follow `Governance KPI Drift Response` in [DOCUMENTATION_RUNBOOKS.md](DOCUMENTATION_RUNBOOKS.md).

## Monitoring and Error Tracking

See [MONITORING.md](MONITORING.md) for error tracking, logging, and observability best practices.

## API Structure and Module Boundaries

- All business logic should be in `src/poseidon/` or `src/models/`.
- Route handlers in `src/controllers/` should only orchestrate, not contain business logic.
- Shared types go in `src/types/`.
- Utilities in `src/utils/` must be stateless and not import from higher-level modules.

## Local Setup

# Poseidon Backend

## Security and Backups


1. **Configure Environment**

   DATABASE_URL="postgresql://user:password@localhost:5432/liveops"

2. **Run Migrations**





```sh

 - Review PRs for architecture violations.

```sh


 - Local one-command smoke (starts/stops backend automatically):
    pnpm run stress:local:smoke
    ```
 - Local one-command spike:


    ```sh

    ```sh
    pnpm run stress:local:soak:quick

 - Generate markdown summary from a JSON report (optionally with baseline):

    ```sh
    pnpm run stress:summary -- stress-artifacts/stress-smoke-report.json stress-artifacts/stress-summary.md scripts/stress/baseline-smoke-report.json

Use `BACKEND_BASE_URL` to point to a non-local environment and use `STRESS_DURATION_SECONDS`, `STRESS_CONNECTIONS`, and `STRESS_PIPELINING` to tune intensity.

Use `STRESS_REGRESSION_WARN_P95_MS`, `STRESS_REGRESSION_WARN_ERROR_RATE`, `STRESS_REGRESSION_WARN_REQUEST_DROP_RATIO`, and `STRESS_REGRESSION_FAIL_ON_WARN` to configure baseline drift behavior in summary generation.

```sh
GITHUB_TOKEN=<token> pnpm run stress:labels:bootstrap -- <owner>/<repo>
```sh
```sh
```
Print built-in default labels without token/API calls:
```sh
```
```sh
pnpm run stress:labels:bootstrap -- --help
```
Emit machine-readable output for automation:
```sh
```
Exit codes for automation handling:
- `0`: success
- `3`: auth/token error
- `4`: GitHub API/network error

Example GitHub Actions step consuming JSON + exit classification:
```yaml
id: label_bootstrap

error_type=$(node -e "const j=JSON.parse(process.argv[1]); process.stdout.write(j.errorType || '');" "$output")

if [ "$code" -eq 0 ]; then
echo "Label bootstrap dry-run succeeded."
elif [ "$code" -eq 2 ]; then
echo "Usage/config error in bootstrap CLI." >&2
exit 3
elif [ "$code" -eq 4 ]; then
echo "GitHub API/network issue; treat as transient retry candidate." >&2
exit 4
else

echo "Unexpected bootstrap failure (type=$error_type)." >&2

exit 1
fi

```

GITHUB_TOKEN=<token> pnpm run stress:labels:bootstrap -- owner/repo --dry-run
Executable workflow option (recommended):

- Workflow: `.github/workflows/backend-label-bootstrap.yml`
GITHUB_TOKEN=<token> pnpm run stress:labels:bootstrap -- <owner>/<repo>
```

Print built-in default labels without token/API calls:

```sh
pnpm run stress:labels:bootstrap -- --help
```

Emit machine-readable output for automation:

```sh
```

Exit codes for automation handling:
- `0`: success
- `3`: auth/token error
- `4`: GitHub API/network error

Example GitHub Actions step consuming JSON + exit classification:

```yaml
id: label_bootstrap

error_type=$(node -e "const j=JSON.parse(process.argv[1]); process.stdout.write(j.errorType || '');" "$output")

if [ "$code" -eq 0 ]; then
echo "Label bootstrap dry-run succeeded."
elif [ "$code" -eq 2 ]; then
echo "Usage/config error in bootstrap CLI." >&2
exit 3
elif [ "$code" -eq 4 ]; then
echo "GitHub API/network issue; treat as transient retry candidate." >&2
exit 4
else
echo "Unexpected bootstrap failure (type=$error_type)." >&2
exit 1
fi
```

GITHUB_TOKEN=<token> pnpm run stress:labels:bootstrap -- owner/repo --dry-run

Executable workflow option (recommended):
- Workflow: `.github/workflows/backend-label-bootstrap.yml`
- Trigger: `workflow_dispatch`

- Modes:
      - `list-defaults` (offline catalog)
      - `dry-run` (GitHub API preview)
      - `apply` (creates missing labels)
- Guardrail: `apply` mode is restricted to the repository default branch.
- Artifact: `backend-label-bootstrap-result` (`label-bootstrap-result.json`)

If `gh` CLI is unavailable locally, dispatch workflows using the built-in helper:

```bash
GITHUB_TOKEN=<token> GITHUB_REPOSITORY=<owner/repo> pnpm run workflow:dispatch:label-bootstrap -- --ref main --inputs '{"mode":"dry-run"}'
GITHUB_TOKEN=<token> GITHUB_REPOSITORY=<owner/repo> pnpm run workflow:dispatch:weekly-reliability -- --ref main --inputs '{"failOnWarn":"true","issueWarningThreshold":"1"}'
GITHUB_TOKEN=<token> GITHUB_REPOSITORY=<owner/repo> pnpm run workflow:dispatch:weekly-reliability -- --ref main --inputs '{"failOnWarn":"true"}' --json --output stress-artifacts/workflow-dispatch-result.json
```

Dispatch helper also supports `--json` and `--output <path>`; output payloads include `schemaVersion: 1` with canonical keys/defaults for machine parsing.

Dispatch and wait for completion in one command:

```bash
GITHUB_TOKEN=<token> GITHUB_REPOSITORY=<owner/repo> pnpm run workflow:dispatch-wait:label-bootstrap -- --ref main --inputs '{"mode":"dry-run"}' --json
```

By default this helper also writes a markdown run summary to `stress-artifacts/workflow-run-summary.md`; override with `--summary-out <path>`.
The npm scripts also write canonical JSON result artifacts by default: `stress-artifacts/workflow-run-weekly-reliability.json` and `stress-artifacts/workflow-run-label-bootstrap.json`.
Dispatch-and-wait helper primary outputs include `schemaVersion: 1` and the canonical key set, using `null`/`false` defaults for non-applicable fields.
Use `--summary-format md|json|both|none` to control artifact format (default: `md`).
Use `--output <path>` to override the canonical result payload JSON path regardless of `--json` console output or summary format.
The weekly reliability workflow also publishes `backend/stress-artifacts/workflow-run-weekly-reliability.json` in each profile artifact bundle.

```bash
pnpm run stress:validate:canonical -- --path stress-artifacts/workflow-run-weekly-reliability.json
```

Post-upload artifact validation enforces minimum validated canonical file counts: nightly `>=1`, weekly `>=2` (spike + soak).
Nightly and weekly workflows also run a post-upload artifact-validation job that downloads produced artifacts and re-validates canonical JSON payloads.
See [SYSTEM_BREAK_TEST_MATRIX.md](SYSTEM_BREAK_TEST_MATRIX.md) for full break-test sequencing and pass criteria, and [STRESS_BASELINE.md](STRESS_BASELINE.md) for current baseline numbers and SLO targets.
- Trigger: `workflow_dispatch`

- Modes:
      - `list-defaults` (offline catalog)
      - `dry-run` (GitHub API preview)
      - `apply` (creates missing labels)
- Guardrail: `apply` mode is restricted to the repository default branch.
- Artifact: `backend-label-bootstrap-result` (`label-bootstrap-result.json`)

If `gh` CLI is unavailable locally, dispatch workflows using the built-in helper:
```bash
GITHUB_TOKEN=<token> GITHUB_REPOSITORY=<owner/repo> pnpm run workflow:dispatch:label-bootstrap -- --ref main --inputs '{"mode":"dry-run"}'
GITHUB_TOKEN=<token> GITHUB_REPOSITORY=<owner/repo> pnpm run workflow:dispatch:weekly-reliability -- --ref main --inputs '{"failOnWarn":"true","issueWarningThreshold":"1"}'
GITHUB_TOKEN=<token> GITHUB_REPOSITORY=<owner/repo> pnpm run workflow:dispatch:weekly-reliability -- --ref main --inputs '{"failOnWarn":"true"}' --json --output stress-artifacts/workflow-dispatch-result.json
```
Dispatch helper also supports `--json` and `--output <path>`; output payloads include `schemaVersion: 1` with canonical keys/defaults for machine parsing.

Dispatch and wait for completion in one command:
```bash
GITHUB_TOKEN=<token> GITHUB_REPOSITORY=<owner/repo> pnpm run workflow:dispatch-wait:label-bootstrap -- --ref main --inputs '{"mode":"dry-run"}' --json
```
By default this helper also writes a markdown run summary to `stress-artifacts/workflow-run-summary.md`; override with `--summary-out <path>`.
The npm scripts also write canonical JSON result artifacts by default: `stress-artifacts/workflow-run-weekly-reliability.json` and `stress-artifacts/workflow-run-label-bootstrap.json`.
Dispatch-and-wait helper primary outputs include `schemaVersion: 1` and the canonical key set, using `null`/`false` defaults for non-applicable fields.
Use `--summary-format md|json|both|none` to control artifact format (default: `md`).
Use `--output <path>` to override the canonical result payload JSON path regardless of `--json` console output or summary format.
The weekly reliability workflow also publishes `backend/stress-artifacts/workflow-run-weekly-reliability.json` in each profile artifact bundle.
```bash
pnpm run stress:validate:canonical -- --path stress-artifacts/workflow-run-weekly-reliability.json
```
Post-upload artifact validation enforces minimum validated canonical file counts: nightly `>=1`, weekly `>=2` (spike + soak).
Nightly and weekly workflows also run a post-upload artifact-validation job that downloads produced artifacts and re-validates canonical JSON payloads.
See [SYSTEM_BREAK_TEST_MATRIX.md](SYSTEM_BREAK_TEST_MATRIX.md) for full break-test sequencing and pass criteria, and [STRESS_BASELINE.md](STRESS_BASELINE.md) for current baseline numbers and SLO targets.


## Troubleshooting

- You can reset the database by dropping and recreating it if needed.

License admin endpoints now return structured audit metadata so operations tooling can correlate changes with actor identity.

All admin mutation responses include:

- `audit.actorId`: caller identity from JWT
### Endpoints

- `GET /license/revocations`
      - Auth: `admin` or `auditor`
      - Response: `{ count, entries[] }`
- `POST /license/revocations`
      - Auth: `admin`
      - Request: `{ licenseKey }` or `{ keyHash }`, optional `{ reason }`
      - Response: revocation entry with `keyHash`, `reason`, `revokedAt`, optional `actorId`
- `DELETE /license/revocations/:keyHash`
      - Auth: `admin`
      - Response: `{ removed: true, keyHash, audit }`
- `POST /license/tools/rotate`
      - Auth: `admin`
      - Request: `{ licenseKey }`, optional `revokePrevious`, `nextExpSeconds`, `org`, `tier`, `features`
      - Response: `{ licenseKey, oldKeyHash, newKeyHash, revokePrevious, expiresAt, claims, audit }`

### Operational Notes

- Rotation defaults to revoking the source key (`revokePrevious: true`).
- The revocation set combines env-configured hashes and runtime/file-backed revocations.
- For local verification, run backend route tests:
      - `pnpm --dir backend exec jest src/routes/license.test.ts`


License admin endpoints now return structured audit metadata so operations tooling can correlate changes with actor identity.

All admin mutation responses include:

- `audit.actorId`: caller identity from JWT
### Endpoints

- `GET /license/revocations`
      - Auth: `admin` or `auditor`
      - Response: `{ count, entries[] }`
- `POST /license/revocations`
      - Auth: `admin`
      - Request: `{ licenseKey }` or `{ keyHash }`, optional `{ reason }`
      - Response: revocation entry with `keyHash`, `reason`, `revokedAt`, optional `actorId`
- `DELETE /license/revocations/:keyHash`
      - Auth: `admin`
      - Response: `{ removed: true, keyHash, audit }`
- `POST /license/tools/rotate`
      - Auth: `admin`
      - Request: `{ licenseKey }`, optional `revokePrevious`, `nextExpSeconds`, `org`, `tier`, `features`
      - Response: `{ licenseKey, oldKeyHash, newKeyHash, revokePrevious, expiresAt, claims, audit }`

### Operational Notes

- Rotation defaults to revoking the source key (`revokePrevious: true`).
- The revocation set combines env-configured hashes and runtime/file-backed revocations.
- For local verification, run backend route tests:
      - `pnpm --dir backend exec jest src/routes/license.test.ts`






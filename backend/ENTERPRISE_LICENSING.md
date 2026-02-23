# Enterprise Licensing Controls

## Navigation
- Related SOP: `DOCUMENTATION_RUNBOOKS.md#license-event-severity-response-runbook`

This document describes the runtime licensing controls added to Poseidon backend.

Scope note: this document is the source of truth for implementation details, workflow settings, and rollout configuration.

## What is implemented
- License validation middleware for all non-exempt API routes
- Enforcement modes via environment variable: `off`, `warn`, `strict`
- Signed license key format with HMAC SHA-256
- Admin/auditor license status endpoint: `GET /license/status`
- License key generator script for controlled issuance

## Environment variables
- `POSEIDON_LICENSE_ENFORCEMENT` (`off|warn|strict`, default: `warn`)
- `POSEIDON_LICENSE_SECRET` (required for signature verification)
- `POSEIDON_LICENSE_KEY` (optional fallback server key)
- `POSEIDON_LICENSE_EXEMPT_PATHS` (optional comma-separated prefixes)
- `POSEIDON_LICENSE_REVOKED_HASHES` (optional comma-separated SHA256 hashes of revoked normalized keys)

## Request header
Clients may send a license key per request via:
- `x-poseidon-license`

If omitted, backend falls back to `POSEIDON_LICENSE_KEY`.

## Admin utility endpoints
- `POST /license/tools/hash` (admin only): returns SHA256 hash for a provided license key
- `POST /license/tools/validate` (admin only): dry-run validation response using current secret + revocation set

Both endpoints emit structured security events without raw key material:
- `license.tools.hash.executed`
- `license.tools.hash.rejected`
- `license.tools.validate.executed`
- `license.tools.validate.rejected`

Event payloads include actor metadata, request metadata, `keyHash`, and validation outcome fields.

Summarize event counts for SIEM/reporting:
```
pnpm --filter backend license:summarize-events -- --file=backend.log --sinceHours=24
```

Write JSON summary artifact to disk:
```
pnpm --filter backend license:summarize-events -- --file=backend.log --sinceHours=24 --out=stress-artifacts/license-events-summary.json
```

CSV export for weekly compliance reporting:
```
pnpm --filter backend license:summarize-events -- --file=backend.log --sinceHours=168 --format=csv
```

Write CSV artifact to disk:
```
pnpm --filter backend license:summarize-events -- --file=backend.log --sinceHours=168 --format=csv --out=stress-artifacts/license-events-summary.csv
```

Create UTC timestamped artifacts for CI uploads:
```
pnpm --filter backend license:export-events -- --file=backend.log --sinceHours=24 --format=both --outDir=stress-artifacts
```

GitHub Actions workflow:
- `.github/workflows/backend-license-events-report.yml`
- Runs weekly and on manual dispatch
- Uploads `license-events-summary-*.json|csv` artifacts

Weekly issue workflow:
- `.github/workflows/backend-license-events-weekly-issue.yml`
- Runs weekly and on manual dispatch
- Upserts `Security: Backend license event weekly summary` issue with top reasons/events/roles
- Uploads JSON summary artifact for traceability
- Computes severity (`low|medium|high`) from invalid/revoked counts and applies `severity:*` issue label
- Supports manual threshold overrides: `mediumSeverityThreshold`, `highSeverityThreshold`
- Supports optional escalation gate: `failOnHighSeverity=true` to fail manual runs when severity is `high`
- Supports optional high-severity assignment: `highSeverityAssignees=user1,user2`
- Scheduled-run fallback: repository variable `LICENSE_ALERT_ASSIGNEES` (comma-separated usernames)
- Scheduled-run fallback for fail gate: repository variable `LICENSE_FAIL_ON_HIGH=true|false`
- Policy defaults: `governance/policies/license-anomaly-escalation-policy.json`
- Precedence: manual workflow-dispatch input -> repository variables -> policy defaults

Anomaly escalation policy controls:
- `severityThresholds.medium.revokedCount` / `severityThresholds.high.revokedCount`
- `workflowDefaults.failOnHighSeverity`
- `workflowDefaults.highSeverityAssignees`

If `LICENSE_MEDIUM_SEVERITY_THRESHOLD` or `LICENSE_HIGH_SEVERITY_THRESHOLD` repository variables are configured, they override policy thresholds for scheduled runs.

Recommended repository variables:
- `LICENSE_ALERT_ASSIGNEES=oncall-user1,oncall-user2`
- `LICENSE_FAIL_ON_HIGH=true`

Setup notes:
- Configure these in GitHub Repository Settings → Secrets and variables → Actions → Variables.
- Keep `LICENSE_ALERT_ASSIGNEES` as GitHub usernames only (comma-separated, no `@`).
- Use `LICENSE_FAIL_ON_HIGH=true` only when on-call routing and runbook escalation are in place.
- Incident SOP reference: `DOCUMENTATION_RUNBOOKS.md#license-event-severity-response-runbook`.

This writes files like `license-events-summary-YYYYMMDDTHHMMSSZ.json` and `.csv`.

Output includes counts by event, reason, day, and actor role.

## Key format
```
POSEIDON-LIC.<base64url-json-payload>.<hex-hmac-signature>
```
Payload can include:
- `org`
- `tier`
- `nbf` (unix seconds)
- `exp` (unix seconds)
- `features` (string array)

## Generate a key
Set secret first, then run:
```
POSEIDON_LICENSE_SECRET=... pnpm --filter backend license:generate -- --org=YourStudio --tier=enterprise --ttlDays=365 --features=liveops,qa,analytics
```

## Generate revocation hashes
For one key:
```
pnpm --filter backend license:hash -- --license=POSEIDON-LIC....
```

For multiple keys from file or stdin:
```
pnpm --filter backend license:hash -- --file=revoked-keys.txt
type revoked-keys.txt | pnpm --filter backend license:hash
```

The script returns `envValue` which can be copied to `POSEIDON_LICENSE_REVOKED_HASHES`.

## Merge revocations safely
To merge new revocations with existing hashes:
```
pnpm --filter backend license:revoke -- --existing=$POSEIDON_LICENSE_REVOKED_HASHES --license=POSEIDON-LIC....
```

From a file (mixed keys and hashes supported):
```
pnpm --filter backend license:revoke -- --file=revoked-keys.txt
```

Use the returned `envValue` as the next `POSEIDON_LICENSE_REVOKED_HASHES` value.

## Staging dry-run validation
Validate candidate keys against current staging server behavior before rollout:
```
pnpm --filter backend license:validate-revocations -- --baseUrl=http://127.0.0.1:4000 --username=admin --password=admin123 --file=revoked-keys.txt
```

Token-based alternative:
```
pnpm --filter backend license:validate-revocations -- --baseUrl=http://127.0.0.1:4000 --token=<admin-jwt> --license=POSEIDON-LIC....
```

This script calls `POST /license/tools/validate` for each key and returns summary counts by reason.

## Rollout recommendation
1. Start in `warn` mode in production.
2. Monitor `x-poseidon-license-warning` and backend logs.
3. Ensure all trusted clients send valid keys.
4. Move to `strict` mode after soak validation.

## Revocation flow
1. Normalize license key by removing `POSEIDON-LIC.` prefix.
2. Compute SHA256 hash of normalized key.
3. Append hash to `POSEIDON_LICENSE_REVOKED_HASHES`.
4. Restart backend or roll environment update.

Note: backend parsing ignores invalid/non-SHA256 entries in `POSEIDON_LICENSE_REVOKED_HASHES`.

## Strict mode go/no-go checklist
- Client key coverage is >= 99% for 7 consecutive days in `warn` mode
- `x-poseidon-license-warning` volume is stable and triaged by reason
- No unresolved false-positive validations (clock skew, stale deployment env, malformed transport)
- Revocation path is tested in staging with a known revoked key
- On-call runbook includes rollback to `warn` and owner escalation path
- Change window approved with customer communication complete

## Strict staging gate drill (`LIC-02`)
Run deterministic strict-mode smoke + endurance checks before enabling strict mode in staging:
```
pnpm --filter backend run liveops:license:strict-staging
```

Optional request-count override:
```
pnpm --filter backend run liveops:license:strict-staging -- --enduranceRequests=500
```

The drill verifies:
- strict mode is active (`POSEIDON_LICENSE_ENFORCEMENT=strict`)
- missing license requests are blocked
- invalid-format licenses are blocked
- revoked licenses are blocked
- valid signed licenses are accepted
- valid-license endurance traffic meets policy thresholds

Policy source of truth:
- `governance/policies/license-strict-staging-rollout-policy.json`

Artifacts:
- report JSON: `backend/tmp/liveops-artifacts/lic-02-license-strict-staging-*.json`
- work directory: `backend/tmp/licensing-strict-staging/<runId>/`

Manual workflow:
- `.github/workflows/backend-license-strict-staging-gate.yml`
- Use this for staging rollout evidence capture and approval-package attachments.

## Rollout checklist by environment

| Environment | `LICENSE_FAIL_ON_HIGH` | Required before enablement |
| --- | --- | --- |
| Dev | `false` | Validate workflow execution, issue upsert, and artifact generation on sample/noisy logs |
| Staging | `false` (initial), then `true` | Validate top-reason accuracy for 2+ weekly cycles, confirm assignee routing, confirm incident runbook ownership |
| Prod | `true` (recommended after soak) | Meet strict go/no-go checklist, confirm on-call coverage, verify no unresolved false-positive high severity in last 14 days |

Operational guidance:
- Move one environment at a time (Dev → Staging → Prod).
- Keep `LICENSE_ALERT_ASSIGNEES` configured before enabling `LICENSE_FAIL_ON_HIGH=true`.
- If a new high severity is unexpected, revert gate to `false`, triage root cause, then re-enable.

## Important note
This is a technical control layer, not legal advice. Pair it with legal agreements (MSA, SLA, DPA, EULA, NDA) and counsel-reviewed enforcement clauses.

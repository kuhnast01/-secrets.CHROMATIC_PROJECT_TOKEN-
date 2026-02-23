# Stress Baseline and SLO Targets

## Baseline Run
- Date: 2026-02-18 (local)
- Environment: local backend (`http://127.0.0.1:4000`)
- Runner: `scripts/stress/run-autocannon.ts` via local orchestrator
- Artifacts:
  - `stress-artifacts/local-smoke-report.json`
  - `stress-artifacts/local-spike-report.json`
  - `stress-artifacts/local-soak-report.json`
  - committed CI baseline: `scripts/stress/baseline-smoke-report.json`
  - committed weekly baselines:
    - `scripts/stress/baseline-spike-report.json`
    - `scripts/stress/baseline-soak-report.json`

## Observed Baselines

### Smoke (`stress:local:smoke`)
- `/healthz`: total `272,177`, p95 `5ms`, error rate `0.00%`
- `/system-health`: total `244,303`, p95 `5ms`, error rate `0.00%`

### Spike (`stress:local:spike`)
- `/healthz`: total `629,609`, p95 `11ms`, error rate `0.00%`
- `/system-health`: total `551,178`, p95 `12ms`, error rate `0.00%`

### Soak Quick (`stress:local:soak` with `90s` duration override)
- `/healthz`: total `883,127`, p95 `8ms`, error rate `0.00%`
- `/system-health`: total `791,083`, p95 `8ms`, error rate `0.00%`

### Soak Full (`stress:local:soak` with default `300s` profile)
- `/healthz`: total `2,312,431`, p95 `9ms`, error rate `0.00%`
- `/system-health`: total `2,156,896`, p95 `9ms`, error rate `0.00%`

## Professional SLO Targets (Gate)
- Error rate: `<= 1.0%` on health endpoints for all stress profiles
- p95 latency:
  - smoke: `<= 300ms`
  - spike: `<= 700ms`
  - soak: `<= 500ms`
- Minimum request volume:
  - smoke: `>= 500`
  - spike: `>= 1500`
  - soak: `>= 3000`

## Recommended Cadence
- Per PR (manual/local): `stress:local:smoke`
- Nightly CI: smoke profile (`.github/workflows/backend-nightly-stress.yml`)
- Weekly reliability runbook: spike + soak (with full 300s soak where practical)
- Nightly CI publishes a markdown summary (`stress-artifacts/stress-summary.md`) into GitHub job summary and artifacts.
- Nightly CI also publishes metadata (`stress-artifacts/stress-summary-meta.json`) and canonical run payload (`stress-artifacts/workflow-run-nightly-stress-smoke.json`) artifacts.
- Nightly CI compares smoke metrics against `scripts/stress/baseline-smoke-report.json` and emits regression warnings using:
  - `STRESS_REGRESSION_WARN_P95_MS`
  - `STRESS_REGRESSION_WARN_ERROR_RATE`
  - `STRESS_REGRESSION_WARN_REQUEST_DROP_RATIO`
  - `STRESS_REGRESSION_FAIL_ON_WARN`
- Current policy in `.github/workflows/backend-nightly-stress.yml`:
  - scheduled nightly runs: warn-only (non-blocking drift)
  - `workflow_dispatch` runs: fail on drift warnings (blocking)
- Weekly reliability policy in `.github/workflows/backend-weekly-reliability.yml`:
  - schedule runs weekly spike + soak in warn-only mode
  - `workflow_dispatch` can be strict via `failOnWarn` and allows threshold overrides + `soakDurationSeconds`
  - opens/updates a GitHub issue when warning count meets/exceeds `issueWarningThreshold`
  - optional triage metadata via `issueLabels` and `issueAssignees` (invalid entries are skipped safely)
  - attempts to apply profile labels (`reliability-<profile>`, `stress-<profile>`) when those labels exist
  - auto-closes the profile issue when run succeeds and warning count returns to zero
  - issue create/update/close automation is restricted to default-branch runs
  - one-time label bootstrap command: `pnpm run stress:labels:bootstrap -- <owner>/<repo>` (requires `GITHUB_TOKEN`)
  - preview-only mode: add `--dry-run` to inspect missing labels before creating
  - offline defaults inspection: `pnpm run stress:labels:bootstrap -- --list-defaults`
  - machine-readable output: add `--json` for CI/automation parsing
  - stratified exits for automation: `2` usage, `3` auth, `4` API, `1` unknown
  - GitHub Actions classified handling example is documented in `backend/README.md`
  - executable dispatch workflow: `.github/workflows/backend-label-bootstrap.yml`
  - dispatch-and-wait helper writes markdown summary artifact (`stress-artifacts/workflow-run-summary.md` by default)
  - `--summary-format md|json|both|none` controls run-summary artifact output type
  - default dispatch-wait npm scripts write canonical JSON artifacts (`stress-artifacts/workflow-run-weekly-reliability.json`, `stress-artifacts/workflow-run-label-bootstrap.json`)
  - dispatch-wait helper output payloads include `schemaVersion: 1` and canonical keys with nullable defaults where not applicable
  - dispatch helper output payloads also support `--json` / `--output` with `schemaVersion: 1` and canonical defaults
  - `--output <path>` overrides canonical result payload JSON path independently of run-summary settings
  - weekly reliability CI artifacts include `backend/stress-artifacts/workflow-run-weekly-reliability.json` per profile run
  - nightly and weekly canonical JSON artifacts use aligned schema keys for downstream automation with `schemaVersion: 1`
  - CI validates canonical JSON artifact schema via `scripts/stress/validate-canonical-result.ts`
  - canonical validation is mode-aware across CI and helper outputs (`weekly-reliability`, `nightly-stress-smoke`, `poll`, `dispatch`, `error`)
  - nightly/weekly workflows include post-upload artifact-validation jobs that re-check canonical payloads from downloaded artifacts
  - minimum validated artifact counts are enforced: nightly `>=1`, weekly `>=2` (spike + soak)

## Notes
- Health endpoints are excluded from rate limiting and audit logging to avoid synthetic benchmark distortion.
- Local dev shows deprecation warnings from swagger tooling (`url.parse` path); track separately as dependency modernization work, not a stress failure.

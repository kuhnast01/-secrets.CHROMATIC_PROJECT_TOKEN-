# System Break Test Matrix

## Goal
Validate smoothness and efficiency under failure, burst traffic, and prolonged operation.

## Current Automated Coverage
- ✅ Unit/integration tests
- ✅ Web and mobile E2E baseline
- ✅ Lighthouse performance baseline
- ✅ Security dependency gates
- ✅ Basic battery test for summon API

## Priority 1: Run Immediately
- [x] **Backend local smoke (single command)**
  - Command: `pnpm run stress:local:smoke`
  - Behavior: starts backend, waits for `/healthz`, runs smoke profile, then stops backend
  - Artifact: `stress-artifacts/local-smoke-report.json`
- [x] **Backend smoke stress**
  - Command: `pnpm run stress:smoke`
  - Target: `/healthz`, `/system-health`
  - Pass: error rate <= 1%, p95 <= 300ms
- [x] **Backend spike stress**
  - Command: `pnpm run stress:spike`
  - Pass: error rate <= 2%, p95 <= 700ms
- [x] **Backend soak stress (bounded baseline run)**
  - Command: `pnpm run stress:local:soak:quick`
  - Pass: no sustained degradation, threshold pass
- [x] **Backend soak stress (full 5+ min)**
  - Command: `pnpm run stress:local:soak`
  - Artifact: `stress-artifacts/local-soak-report.json`
  - Pass: no sustained degradation, threshold pass

## Automated Nightly Coverage
- Workflow: `.github/workflows/backend-nightly-stress.yml`
- Schedule: daily at 07:00 UTC
- Profile: smoke stress (`pnpm run stress:smoke`)
- Artifacts: backend logs and JSON summary report (`stress-artifacts/stress-smoke-report.json`)

## Automated Weekly Reliability Coverage
- Workflow: `.github/workflows/backend-weekly-reliability.yml`
- Schedule: Mondays at 08:00 UTC
- Profiles: spike + soak (`pnpm run stress:spike`, `pnpm run stress:soak`)
- Artifacts (per profile):
  - `stress-artifacts/stress-<profile>-report.json`
  - `stress-artifacts/stress-<profile>.log`
  - `stress-artifacts/stress-<profile>-summary.md`
- Manual dispatch controls:
  - `failOnWarn`
  - `warnP95Ms`
  - `warnErrorRate`
  - `warnRequestDropRatio`
  - `soakDurationSeconds`
  - `issueWarningThreshold`
- Optional issue triage metadata:
  - `issueLabels` (comma-separated existing labels)
  - `issueAssignees` (comma-separated GitHub usernames)
- Auto-triage: creates or comments on a GitHub issue when warning count is above configured threshold.
- Auto-resolution: closes the open profile issue when a successful run returns to zero warnings.

## Priority 2: Failure Injection (Game Day)
- [x] Kill/restart backend during active stress run and confirm recovery within SLO
  - Evidence (2026-02-17 local): backend PID `48776` killed during active spike profile (`--duration=90`)
  - Recovery: `/healthz` returned healthy in `43.441s` (kill timestamp to healthy timestamp)
  - Outcome: stress run passed thresholds and report was generated at `stress-artifacts/failure-injection-spike-report.json`
- [x] Simulate DB unavailability and verify graceful API errors + recovery
  - Evidence (2026-02-17 local): service-level PostgreSQL stop/start is permission-blocked in this environment (`Cannot open postgresql-x64-16 service on computer .`)
  - Executed fallback drill: restarted backend with invalid `DATABASE_URL` (`127.0.0.1:6543`) to simulate DB unreachable state at app layer
  - Degraded behavior: `/healthz` remained `200`; DB-backed `/users` returned graceful `500` with logged Prisma initialization error
  - Recovery behavior: after restoring normal backend config, `/users` returned `200` in `0.179s`
  - Artifact: `stress-artifacts/db-unavailability-drill.json`
- [x] Run backup restore drill and measure RTO/RPO against DR plan
  - Evidence (2026-02-17 local): executed `pg_dump` backup + restore to verification database `liveops_restore_drill`
  - Backup duration: `0.099s`
  - RTO (restore completion): `0.095s`
  - RPO check (row-count delta across `User`, `Event`, `AuditLog`, `Analytics`): `0` (match = `true`)
  - Artifact: `stress-artifacts/backup-restore-drill.json`

## Priority 3: Security Abuse and Rate Limits
- [x] Login storm (invalid credentials burst) to validate lockout/rate-limit behavior
  - Evidence (2026-02-17 local): executed 320 invalid `/auth/login` attempts
  - Observed behavior: first 100 requests returned `401 Invalid credentials`, subsequent 220 requests returned `429 Too Many Requests`
  - Outcome: limiter enforced configured threshold (`max=100` per 15 minutes) without transport failures
  - Artifact: `stress-artifacts/login-storm-drill.json`
- [x] Protected endpoint flood with missing/invalid token
  - Evidence (2026-02-17 local): executed 200 requests against protected `/users` endpoint with alternating missing-token and invalid-token calls
  - Observed behavior: `401:50`, `403:50`, `429:100` (pre-threshold auth rejects followed by limiter throttling)
  - Outcome: auth middleware rejected missing/invalid credentials and limiter enforced threshold under burst abuse
  - Artifact: `stress-artifacts/protected-endpoint-token-flood-drill.json`
- [x] Oversized payload and malformed JSON flood against public endpoints
  - Evidence (2026-02-17 local): executed 200 requests against public `/auth/login` endpoint with alternating malformed JSON and oversized (`~150 KB`) payloads
  - Observed behavior: `400:50`, `413:50`, `429:100` (parser-level rejections before threshold, then limiter throttling)
  - Outcome: middleware order was hardened so rate limiting executes before JSON parsing; payload abuse now receives throttle protection after threshold while preserving parser rejection behavior
  - Artifact: `stress-artifacts/payload-abuse-flood-drill.json`

## Priority 4: End-to-End Endurance
- [x] Repeat Cypress critical paths for 1 hour
  - Evidence (2026-02-17 local): added reusable endurance runner at `e2e/cypress/run-endurance.mjs` and aligned suite to admin critical path (`e2e/cypress/e2e/admin.cy.ts`) with backend API stubs for deterministic endurance validation
  - Alignment validation artifacts:
    - `e2e/cypress/artifacts/cypress-endurance-report-quick.json`
    - `e2e/cypress/artifacts/cypress-endurance-report-baseline.json`
    - `e2e/cypress/artifacts/cypress-endurance-report-aligned.json` (3 runs, 3 passed)
  - Full endurance run artifact: `e2e/cypress/artifacts/cypress-endurance-report-1h.json`
  - Final metrics: `runsAttempted=220`, `runsPassed=220`, `runsFailed=0`, `durationMs=20312260` (terminal exit code `0`)
- [ ] Repeat Detox smoke flow on emulator loop
  - Evidence (2026-02-18 local): installed Detox + Jest at workspace root, installed Android Studio + OpenJDK + SDK cmdline-tools + emulator packages, created AVD `Pixel_3a_API_30_x86`, generated Android native project for `apps/mobile` (`expo prebuild --platform android --no-install`), and executed quick loop via `pnpm run e2e:detox:endurance:quick -- --artifact=e2e/detox/artifacts/detox-endurance-report-quick.json`
  - Additional remediation attempts (2026-02-18 local): moved Android build attempt to isolated short non-OneDrive path (`C:\mobilebuild`), aligned Expo SDK dependency versions, successfully built both APKs (`assembleDebug`, `assembleAndroidTest`), copied artifacts to main workspace expected paths, and reran quick loop
  - Artifact: `e2e/detox/artifacts/detox-endurance-report-quick.json`
  - Current blocker: Detox now reaches app launch and test execution phases but fails runtime handshake (`Failed to run application on the device`, app disconnects before ready message)
  - Remediation: debug emulator/runtime startup path for `apps/mobile` under Detox (app boot logs/instrumentation readiness), then re-run quick loop and full endurance loop (`pnpm run e2e:detox:endurance`)
- [ ] Monitor memory growth and handle leak suspects before release

## Runbook
1. Start backend in one terminal: `pnpm --filter backend dev`
2. Execute Priority 1 commands in sequence.
3. Record failures, p95/p99 drift, and error signatures.
4. Open issues for every threshold breach with logs and repro steps.
5. Re-run after fixes and mark checklist items complete.

## Environment Overrides
- `BACKEND_BASE_URL` (default `http://127.0.0.1:4000`)
- `STRESS_DURATION_SECONDS`
- `STRESS_CONNECTIONS`
- `STRESS_PIPELINING`

## Backend Stress Summary

- Profile: `soak`
- Base URL: `http://127.0.0.1:4000`
- Generated: `2026-02-18T02:02:55.953Z`
- Overall: **PASS**
- Baseline: `scripts/stress/baseline-soak-report.json` (loaded and comparable)

| Endpoint | Total Requests | p95 (ms) | Error Rate | Status |
|---|---:|---:|---:|---|
| /healthz | 815410 | 8 | 0.00% | PASS |
| /system-health | 630727 | 10 | 0.00% | PASS |

### Thresholds
- max error rate: `1.00%`
- max p95: `500ms`
- min requests: `3000`

### Baseline Delta
| Endpoint | p95 Delta (ms) | Error Rate Delta | Request Delta |
|---|---:|---:|---:|
| /healthz | 0 | 0.00% | -67717 |
| /system-health | 2 | 0.00% | -160356 |

### Regression Guardrails
- max p95 increase: `20ms`
- max error-rate increase: `0.20%`
- max request drop ratio: `20.00%`
- fail on warning: `false`
- drift check: WARN (1)

| Endpoint | Metric | Baseline | Current | Delta | Threshold |
|---|---|---:|---:|---:|---:|
| /system-health | requestDrop | 791083 | 630727 | 20.27% | 20.00% |

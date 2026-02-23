## Backend Stress Summary

- Profile: `spike`
- Base URL: `http://127.0.0.1:4000`
- Generated: `2026-02-18T01:45:43.246Z`
- Overall: **PASS**

| Endpoint | Total Requests | p95 (ms) | Error Rate | Status |
|---|---:|---:|---:|---|
| /healthz | 629609 | 11 | 0.00% | PASS |
| /system-health | 551178 | 12 | 0.00% | PASS |

### Thresholds
- max error rate: `2.00%`
- max p95: `700ms`
- min requests: `1500`

### Baseline Delta
| Endpoint | p95 Delta (ms) | Error Rate Delta | Request Delta |
|---|---:|---:|---:|
| /healthz | 0 | 0.00% | 0 |
| /system-health | 0 | 0.00% | 0 |

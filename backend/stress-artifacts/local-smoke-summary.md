## Backend Stress Summary

- Profile: `smoke`
- Base URL: `http://127.0.0.1:4000`
- Generated: `2026-02-18T01:41:38.588Z`
- Overall: **PASS**

| Endpoint | Total Requests | p95 (ms) | Error Rate | Status |
|---|---:|---:|---:|---|
| /healthz | 272177 | 5 | 0.00% | PASS |
| /system-health | 244303 | 5 | 0.00% | PASS |

### Thresholds
- max error rate: `1.00%`
- max p95: `300ms`
- min requests: `500`

### Baseline Delta
| Endpoint | p95 Delta (ms) | Error Rate Delta | Request Delta |
|---|---:|---:|---:|
| /healthz | 0 | 0.00% | 0 |
| /system-health | 0 | 0.00% | 0 |

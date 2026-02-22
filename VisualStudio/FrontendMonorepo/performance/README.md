# Performance Testing (k6)

## Overview
This directory contains industry-standard performance test scripts for your backend using [k6](https://k6.io/). These scripts cover smoke, stress, and soak testing, targeting the `/system-health` endpoint as an example. You can adapt the target URL for other endpoints as needed.

## Prerequisites
- Download the k6 binary for Windows from: https://k6.io/docs/getting-started/installation/
- Extract the binary and add it to your PATH, or run it directly from the extracted folder.

## How to Run
From the root of your workspace, run:

```
k6 run performance/k6-smoke.js   # Quick health/load check
k6 run performance/k6-stress.js  # Stress test (ramp up, spike, ramp down)
k6 run performance/k6-soak.js    # Soak test (sustained load)
```

## Script Descriptions
- **k6-smoke.js**: 10 users, 30 seconds, basic health check.
- **k6-stress.js**: Ramps from 20 to 100 users, spikes, then ramps down.
- **k6-soak.js**: 20 users for 10 minutes, checks for memory leaks and stability.

## Best Practices
- Run these tests against a staging or dedicated performance environment.
- Monitor backend CPU, memory, and database during tests.
- Review k6 output for error rates, response times, and bottlenecks.
- Integrate k6 into CI/CD for automated regression performance checks.

---

For more advanced scenarios, see the [k6 documentation](https://k6.io/docs/).

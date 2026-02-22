#!/usr/bin/env node
// Automated backend health check script
import fetch from 'node-fetch';

const endpoints = [
  'http://127.0.0.1:4000/healthz',
  'http://127.0.0.1:4000/system-health',
];

async function checkEndpoint(url) {
  try {
    const res = await fetch(url);
    if (res.status === 200) {
      console.log(`[OK] ${url}`);
      return true;
    } else {
      console.error(`[FAIL] ${url} - Status: ${res.status}`);
      return false;
    }
  } catch (err) {
    console.error(`[ERROR] ${url} - ${err.message}`);
    return false;
  }
}

(async () => {
  let allOk = true;
  for (const url of endpoints) {
    const ok = await checkEndpoint(url);
    if (!ok) allOk = false;
  }
  if (!allOk) {
    process.exit(1);
  } else {
    console.log('All health checks passed.');
    process.exit(0);
  }
})();

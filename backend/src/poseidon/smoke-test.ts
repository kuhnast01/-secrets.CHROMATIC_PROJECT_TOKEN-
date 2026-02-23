// Poseidon Smoke Test
// Quick check for core features

import { createPoseidonApp } from './index';

export async function smokeTest() {
  const app = await createPoseidonApp();
  // Stub: Add real endpoint checks
  return app ? 'Smoke test passed' : 'Smoke test failed';
}

// Example usage:
// smokeTest().then(console.log);

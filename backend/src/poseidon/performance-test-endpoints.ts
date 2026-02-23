// Poseidon Endpoint-Connected Performance Test
// Benchmarks response times for endpoints

import axios from 'axios';

export async function performanceTestEndpoints(baseUrl: string, token: string) {
  const start = Date.now();
  try {
    await axios.get(`${baseUrl}/events`, { headers: { Authorization: `Bearer ${token}` } });
    const duration = Date.now() - start;
    return `Performance test passed in ${duration}ms`;
  } catch (err) {
    return `Performance test failed: ${err}`;
  }
}

// Example usage:
// performanceTestEndpoints('http://localhost:3000', 'your-jwt-token').then(console.log);

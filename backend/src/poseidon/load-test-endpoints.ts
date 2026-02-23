// Poseidon Endpoint-Connected Load Test
// Measures system behavior with increasing load

import axios from 'axios';

export async function loadTestEndpoints(baseUrl: string, token: string, users: number = 100) {
  let responses = 0;
  for (let i = 0; i < users; i++) {
    try {
      await axios.get(`${baseUrl}/events`, { headers: { Authorization: `Bearer ${token}` } });
      responses++;
    } catch (err) {
      // Optionally log failures
    }
  }
  return responses === users ? 'Load test passed' : `Load test failed: ${responses}/${users}`;
}

// Example usage:
// loadTestEndpoints('http://localhost:3000', 'your-jwt-token', 100).then(console.log);

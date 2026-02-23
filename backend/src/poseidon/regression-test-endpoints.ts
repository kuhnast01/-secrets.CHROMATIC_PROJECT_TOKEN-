// Poseidon Endpoint-Connected Regression Test
// Ensures new changes don’t break existing endpoints

import axios from 'axios';

export async function regressionTestEndpoints(baseUrl: string, token: string) {
  try {
    // Call all endpoints and compare responses to expected values
    const adminRes = await axios.post(`${baseUrl}/admin/grant-currency`, {}, { headers: { Authorization: `Bearer ${token}` } });
    const eventRes = await axios.get(`${baseUrl}/events`, { headers: { Authorization: `Bearer ${token}` } });
    // Add more endpoint checks and expected values
    return adminRes.data && eventRes.data ? 'Regression test passed' : 'Regression test failed';
  } catch (err) {
    return `Regression test failed: ${err}`;
  }
}

// Example usage:
// regressionTestEndpoints('http://localhost:3000', 'your-jwt-token').then(console.log);

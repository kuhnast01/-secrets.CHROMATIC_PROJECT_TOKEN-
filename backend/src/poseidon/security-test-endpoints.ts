// Poseidon Endpoint-Connected Security Test
// Checks access control and vulnerabilities on endpoints

import axios from 'axios';

export async function securityTestEndpoints(baseUrl: string, token: string) {
  try {
    // Attempt admin endpoint with valid token
    const adminRes = await axios.post(`${baseUrl}/admin/grant-currency`, {}, { headers: { Authorization: `Bearer ${token}` } });
    // Attempt admin endpoint with invalid token
    let unauthorized = false;
    try {
      await axios.post(`${baseUrl}/admin/grant-currency`, {}, { headers: { Authorization: 'Bearer invalid' } });
    } catch (err) {
      unauthorized = true;
    }
    return adminRes.data && unauthorized ? 'Security test passed' : 'Security test failed';
  } catch (err) {
    return `Security test failed: ${err}`;
  }
}

// Example usage:
// securityTestEndpoints('http://localhost:3000', 'your-jwt-token').then(console.log);

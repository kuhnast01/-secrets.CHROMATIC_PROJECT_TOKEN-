// Poseidon Endpoint-Connected Smoke Test
// Calls real admin and event endpoints

import axios from 'axios';

export async function smokeTestEndpoints(baseUrl: string, token: string) {
  try {
    const adminRes = await axios.post(`${baseUrl}/admin/grant-currency`, {}, { headers: { Authorization: `Bearer ${token}` } });
    const eventRes = await axios.get(`${baseUrl}/events`, { headers: { Authorization: `Bearer ${token}` } });
    const licenseRes = await axios.get(`${baseUrl}/license/status`, { headers: { Authorization: `Bearer ${token}` } });
    return [adminRes.data, eventRes.data, licenseRes.data];
  } catch (err) {
    return `Smoke test failed: ${err}`;
  }
}

// Example usage:
// smokeTestEndpoints('http://localhost:3000', 'your-jwt-token').then(console.log);

// Simple token storage and refresh logic for web (localStorage) and mobile (can swap for SecureStore)

let token: string | null = null;
let refreshToken: string | null = null;

export function setTokens(newToken: string, newRefreshToken: string) {
  token = newToken;
  refreshToken = newRefreshToken;
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', newToken);
    localStorage.setItem('refreshToken', newRefreshToken);
  }
}

export function getToken() {
  if (!token && typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }
  return token;
}

export function getRefreshToken() {
  if (!refreshToken && typeof window !== 'undefined') {
    refreshToken = localStorage.getItem('refreshToken');
  }
  return refreshToken;
}

export function clearTokens() {
  token = null;
  refreshToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }
}

// Example refresh function (replace with real API call)
export async function refreshAuthToken() {
  // Simulate refresh
  const newToken = 'refreshed-token';
  setTokens(newToken, getRefreshToken() || '');
  return newToken;
}

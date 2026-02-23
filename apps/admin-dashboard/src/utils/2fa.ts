// 2fa.ts - Two-Factor Authentication utilities (scaffold)
// In production, integrate with backend and TOTP/email/SMS provider

export async function request2FACode(username: string) {
  // Call backend to send 2FA code
  return fetch('/api/2fa/request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });
}

export async function verify2FACode(username: string, code: string) {
  // Call backend to verify 2FA code
  return fetch('/api/2fa/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, code }),
  });
}

"use strict";
// 2fa.ts - Two-Factor Authentication utilities (scaffold)
// In production, integrate with backend and TOTP/email/SMS provider
Object.defineProperty(exports, "__esModule", { value: true });
exports.request2FACode = request2FACode;
exports.verify2FACode = verify2FACode;
async function request2FACode(username) {
    // Call backend to send 2FA code
    return fetch('/api/2fa/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
    });
}
async function verify2FACode(username, code) {
    // Call backend to verify 2FA code
    return fetch('/api/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, code }),
    });
}

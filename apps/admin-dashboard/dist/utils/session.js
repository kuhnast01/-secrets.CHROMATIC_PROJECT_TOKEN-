"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = logout;
exports.isSessionActive = isSessionActive;
exports.autoLogoutOnInactivity = autoLogoutOnInactivity;
// session.ts - Secure session management (scaffold)
function logout() {
    localStorage.removeItem('admin_token');
    window.location.href = '/login';
}
function isSessionActive() {
    // Optionally check token expiry or ping backend
    return !!localStorage.getItem('admin_token');
}
function autoLogoutOnInactivity(timeoutMs = 30 * 60 * 1000) {
    let timer;
    const reset = () => {
        clearTimeout(timer);
        timer = setTimeout(logout, timeoutMs);
    };
    window.addEventListener('mousemove', reset);
    window.addEventListener('keydown', reset);
    reset();
}

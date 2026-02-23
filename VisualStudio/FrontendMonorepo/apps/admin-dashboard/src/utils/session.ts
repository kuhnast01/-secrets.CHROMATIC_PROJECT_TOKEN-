// session.ts - Secure session management (scaffold)
export function logout() {
  localStorage.removeItem('admin_token');
  window.location.href = '/login';
}

export function isSessionActive() {
  // Optionally check token expiry or ping backend
  return !!localStorage.getItem('admin_token');
}

export function autoLogoutOnInactivity(timeoutMs: number = 30 * 60 * 1000) {
  let timer: any;
  const reset = () => {
    clearTimeout(timer);
    timer = setTimeout(logout, timeoutMs);
  };
  window.addEventListener('mousemove', reset);
  window.addEventListener('keydown', reset);
  reset();
}

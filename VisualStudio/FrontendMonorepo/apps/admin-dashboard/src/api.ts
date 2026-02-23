// Centralized API utility for admin dashboard
const API_URL = process.env.VITE_API_URL || 'https://your-backend-api.com';

export async function apiRequest(path: string, options: Record<string, any> = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : undefined;
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'API error');
  }
  return res.json();
}

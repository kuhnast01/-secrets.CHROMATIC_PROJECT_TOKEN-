
import { apiFetch } from '../api';

export interface AuditEntry<T = unknown> {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  details?: T;
}

export function logAudit<T = unknown>(user: string, action: string, details?: T) {
  // Persist to backend API
  apiFetch('/audit-log', {
    method: 'POST',
    body: JSON.stringify({ user, action, details }),
  }).catch(() => {});
}

export async function getAuditTrail<T = unknown>(): Promise<AuditEntry<T>[]> {
  try {
    return await apiFetch('/audit-log');
  } catch {
    return [];
  }
}

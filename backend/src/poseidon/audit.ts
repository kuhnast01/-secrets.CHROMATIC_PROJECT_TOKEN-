// Sprint 7: Security, Audit, and Compliance for Poseidon
// Adds audit logging, access control, and compliance helpers.

export type AuditActionType = 'plan' | 'step' | 'feedback' | 'error' | 'access';

export interface AuditLogEntry {
  timestamp: number;
  user: string;
  actionType: AuditActionType;
  description: string;
  details?: any;
}

export class AuditLogger {
  private logs: AuditLogEntry[] = [];

  log(entry: AuditLogEntry) {
    this.logs.push(entry);
  }

  getLogsByUser(user: string): AuditLogEntry[] {
    return this.logs.filter(l => l.user === user);
  }

  getLogsByAction(actionType: AuditActionType): AuditLogEntry[] {
    return this.logs.filter(l => l.actionType === actionType);
  }

  getAllLogs(): AuditLogEntry[] {
    return [...this.logs];
  }
}

// Simple access control: user roles and permissions
export type UserRole = 'admin' | 'engineer' | 'auditor' | 'guest';

export interface User {
  username: string;
  role: UserRole;
}

export function canPerformAction(user: User, action: AuditActionType): boolean {
  const rolePermissions: Record<UserRole, AuditActionType[]> = {
    admin: ['plan', 'step', 'feedback', 'error', 'access'],
    engineer: ['plan', 'step', 'feedback', 'error'],
    auditor: ['feedback', 'error', 'access'],
    guest: [],
  };
  return rolePermissions[user.role].includes(action);
}

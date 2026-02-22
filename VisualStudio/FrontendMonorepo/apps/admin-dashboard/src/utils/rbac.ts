// rbac.ts - Role-Based Access Control utilities
export type Role = 'superadmin' | 'admin' | 'editor' | 'viewer';

export function canEdit(role: Role) {
  return role === 'superadmin' || role === 'admin' || role === 'editor';
}

export function canDelete(role: Role) {
  return role === 'superadmin' || role === 'admin';
}

export function canView(role: Role) {
  return true;
}

export function canManageUsers(role: Role) {
  return role === 'superadmin';
}

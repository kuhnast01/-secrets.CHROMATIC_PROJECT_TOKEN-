export type Role = 'admin' | 'operator' | 'designer' | 'support' | 'viewer';

export interface User {
  id: string;
  name: string;
  role: Role;
}

// Utility to fetch users from backend
import { apiFetch } from '../../api';

export async function fetchUsers(): Promise<User[]> {
  return apiFetch('/users');
}

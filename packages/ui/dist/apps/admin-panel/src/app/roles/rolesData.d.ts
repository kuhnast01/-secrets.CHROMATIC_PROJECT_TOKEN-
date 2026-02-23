export type Role = 'admin' | 'operator' | 'designer' | 'support' | 'viewer';
export interface User {
    id: string;
    name: string;
    role: Role;
}
export interface AuditLogEntry {
    id: string;
    user: string;
    action: string;
    target: string;
    before?: Record<string, unknown>;
    after?: Record<string, unknown>;
    timestamp: string;
}
export declare const users: User[];
export declare const auditLog: AuditLogEntry[];

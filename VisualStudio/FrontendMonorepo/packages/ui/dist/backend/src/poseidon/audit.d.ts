export type AuditActionType = 'plan' | 'step' | 'feedback' | 'error' | 'access';
export interface AuditLogEntry {
    timestamp: number;
    user: string;
    actionType: AuditActionType;
    description: string;
    details?: any;
}
export declare class AuditLogger {
    private logs;
    log(entry: AuditLogEntry): void;
    getLogsByUser(user: string): AuditLogEntry[];
    getLogsByAction(actionType: AuditActionType): AuditLogEntry[];
    getAllLogs(): AuditLogEntry[];
}
export type UserRole = 'admin' | 'engineer' | 'auditor' | 'guest';
export interface User {
    username: string;
    role: UserRole;
}
export declare function canPerformAction(user: User, action: AuditActionType): boolean;

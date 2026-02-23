export interface AuditEntry<T = unknown> {
    id: string;
    user: string;
    action: string;
    timestamp: string;
    details?: T;
}
export declare function logAudit<T = unknown>(user: string, action: string, details?: T): void;
export declare function getAuditTrail<T = unknown>(): Promise<AuditEntry<T>[]>;

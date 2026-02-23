export declare function getAuditLogs(): Promise<{
    details: import("@prisma/client/runtime/library").JsonValue | null;
    id: number;
    action: string;
    user_id: number | null;
    timestamp: Date;
}[]>;

export interface LogEntry {
    timestamp: number;
    level: 'info' | 'warn' | 'error';
    message: string;
    meta?: any;
}
export declare class BackendMonitor {
    private logs;
    ingestLog(entry: LogEntry): void;
    classifyErrors(): {
        errorCount: number;
        errors: LogEntry[];
    };
    summarizeIncidents(): string;
    suggestPatch(): string;
}

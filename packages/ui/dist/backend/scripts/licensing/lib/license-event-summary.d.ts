export interface EventRow {
    time?: number;
    event?: string;
    reason?: string | null;
    valid?: boolean;
    revoked?: boolean;
    actorRole?: string | null;
}
export interface SummaryCounts {
    byEvent: Record<string, number>;
    byReason: Record<string, number>;
    byDay: Record<string, number>;
    byRole: Record<string, number>;
}
export interface SummaryInput {
    lines: string[];
    sinceHours: number;
    nowMs?: number;
}
export interface SummaryResult {
    schemaVersion: number;
    window: {
        sinceHours: number;
        fromIso: string;
        toIso: string;
    };
    scanned: number;
    parsedRows: number;
    ignoredRows: number;
    trackedEvents: string[];
    counts: SummaryCounts;
}
export type OutputFormat = 'json' | 'csv';
export declare const TRACKED_EVENTS: Set<string>;
export declare function summarizeLicenseEvents(input: SummaryInput): SummaryResult;
export declare function renderSummary(result: SummaryResult, format: OutputFormat): string;

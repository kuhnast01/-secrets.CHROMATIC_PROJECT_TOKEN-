export interface AnalyticsEvent {
    type: string;
    value: number;
    userId?: string;
    timestamp: number;
}
export declare class StudioIntelligence {
    private events;
    ingestEvent(event: AnalyticsEvent): void;
    retentionPrediction(): string;
    monetizationAnomaly(): string;
    clusterCrashes(): {
        clusters: number;
    };
    performanceTrend(): string;
    recommendImprovements(): string[];
}

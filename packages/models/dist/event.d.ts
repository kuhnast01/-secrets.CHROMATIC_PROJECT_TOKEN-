export interface BattlePassData {
    id: string;
    userId: string;
    season: string;
    tiers: Array<{
        id: string;
        rewards: string[];
        claimed: boolean;
    }>;
    progress: number;
    premium: boolean;
    premiumPlus?: boolean;
}
export interface EventVersion {
    phases: any[];
    author: string;
    timestamp: string;
    status: string;
    summary: string;
}
//# sourceMappingURL=event.d.ts.map
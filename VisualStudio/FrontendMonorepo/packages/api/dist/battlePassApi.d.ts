import type { BattlePassData } from '../../models/src/event';
export declare function getBattlePass(): Promise<BattlePassData>;
export declare function upgradeBattlePass(type: 'premium' | 'premiumPlus'): Promise<{
    success: boolean;
    message?: string;
}>;
export declare function claimBattlePassTier(tierId: string, rewardType: 'free' | 'premium' | 'premiumPlus'): Promise<{
    success: boolean;
    message?: string;
}>;
//# sourceMappingURL=battlePassApi.d.ts.map
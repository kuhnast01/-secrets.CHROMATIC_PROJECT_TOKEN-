import React from 'react';
interface Tier {
    id: string;
    title: string;
    status: string;
    xp: number;
    reward: string;
    claimed: boolean;
}
interface BattlePassTrackProps {
    tiers: Tier[];
    currentTierId: string;
    onTierClick: (tier: Tier) => void;
}
declare const BattlePassTrack: React.FC<BattlePassTrackProps>;
export default BattlePassTrack;

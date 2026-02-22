import React from 'react';
export interface TierCardProps {
    id: string;
    title: string;
    status: string;
    xp: number;
    reward: string;
    claimed: boolean;
    isCurrent?: boolean;
    onPress?: () => void;
}
export declare const TierCard: React.FC<TierCardProps>;
//# sourceMappingURL=TierCard.native.d.ts.map
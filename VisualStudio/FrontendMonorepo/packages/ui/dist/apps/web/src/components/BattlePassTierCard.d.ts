import React from 'react';
import { TierCardWebProps } from '@ui';
interface BattlePassTierCardProps {
    tier: TierCardWebProps;
    isCurrent: boolean;
    onClick: () => void;
}
declare const BattlePassTierCard: React.FC<BattlePassTierCardProps>;
export default BattlePassTierCard;

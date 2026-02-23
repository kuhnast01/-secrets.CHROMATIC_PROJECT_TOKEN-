import React from 'react';
import { TierCardNative, TierCardNativeProps } from '../../../../packages/ui/src';

const BattlePassTierCard = ({ tier, isCurrent, onPress }: { tier: TierCardNativeProps; isCurrent: boolean; onPress: () => void }) => {
  return <TierCardNative {...tier} isCurrent={isCurrent} onPress={onPress} />;
};

export default BattlePassTierCard;

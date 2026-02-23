import React from 'react';
import { RewardPopup } from './RewardPopup';

export default {
  title: 'Shop/RewardPopup',
  component: RewardPopup,
};

export const Default = () => (
  <RewardPopup
    visible={true}
    imageUrl="https://via.placeholder.com/80"
    name="Epic Sword"
    amount={1}
    rarity="epic"
    onContinue={() => {}}
    description="Congratulations! You received an Epic Sword."
  />
);

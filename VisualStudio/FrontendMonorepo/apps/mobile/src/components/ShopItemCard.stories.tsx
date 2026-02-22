import React from 'react';
import { ShopItemCard } from './ShopItemCard';
import { View } from 'react-native';

export default {
  title: 'Shop/ShopItemCard',
  component: ShopItemCard,
};

export const Default = () => (
  <View style={{ padding: 16 }}>
    <ShopItemCard
      name="Epic Sword"
      rarity="epic"
      price={1000}
      currency="gold"
      imageUrl="https://via.placeholder.com/80"
      purchaseLimit={'3/5'}
      disabled={false}
      timer={null}
      onPurchase={() => {}}
      onGift={() => {}}
    />
  </View>
);

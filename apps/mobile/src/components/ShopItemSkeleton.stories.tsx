import React from 'react';
import ShopItemSkeleton from './ShopItemSkeleton';
import { View } from 'react-native';

export default {
  title: 'Shop/ShopItemSkeleton',
  component: ShopItemSkeleton,
};

export const Default = () => (
  <View style={{ padding: 16 }}>
    <ShopItemSkeleton />
  </View>
);

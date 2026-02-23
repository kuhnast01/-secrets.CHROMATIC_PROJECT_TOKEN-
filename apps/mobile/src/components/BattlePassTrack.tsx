import React from 'react';
import { FlatList, View } from 'react-native';
import BattlePassTierCard from './BattlePassTierCard';

const BattlePassTrack = ({ tiers, currentTierId, onTierPress }) => (
  <FlatList
    data={tiers}
    keyExtractor={item => item.id}
    renderItem={({ item }) => (
      <BattlePassTierCard
        tier={item}
        isCurrent={item.id === currentTierId}
        onPress={() => onTierPress(item)}
      />
    )}
    horizontal
    showsHorizontalScrollIndicator={false}
    style={{ marginVertical: 16 }}
  />
);

export default BattlePassTrack;

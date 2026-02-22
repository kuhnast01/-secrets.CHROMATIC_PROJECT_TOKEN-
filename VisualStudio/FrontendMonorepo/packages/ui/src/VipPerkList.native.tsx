import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface VipPerkListProps {
  perks: string[];
}

export function VipPerkList({ perks }: VipPerkListProps) {
  if (!perks || perks.length === 0) {
    return <Text style={styles.empty}>No perks available.</Text>;
  }
  return (
    <View style={styles.list}>
      {perks.map((perk, i) => (
        <Text key={i} style={styles.item}>
          {/* TODO: Add icon support if available */}
          {perk}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { paddingLeft: 8 },
  item: { fontSize: 15, color: '#444', marginBottom: 4 },
  empty: { color: '#aaa', fontSize: 14 },
});

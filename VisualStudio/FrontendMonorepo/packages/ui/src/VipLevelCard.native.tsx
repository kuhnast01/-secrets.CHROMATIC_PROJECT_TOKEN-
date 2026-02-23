import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VipPerkList } from './VipPerkList';

interface VipLevelCardProps {
  level: number;
  perks: string[];
  dailyReward: string;
  locked: boolean;
  current: boolean;
}

export function VipLevelCard({ level, perks, dailyReward, locked, current }: VipLevelCardProps) {
  return (
    <View style={[styles.card, locked && styles.locked, current && styles.current]}>
      <Text style={styles.level}>Level {level} {current ? <Text style={styles.currentText}>(Current)</Text> : null}</Text>
      <View style={styles.perks}><VipPerkList perks={perks} /></View>
      <Text style={styles.daily}>Daily Reward: {dailyReward}</Text>
      {locked ? <Text style={styles.lockedText}>Locked</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginVertical: 8,
    minWidth: 220,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  locked: {
    opacity: 0.5,
  },
  current: {
    backgroundColor: '#e6f7ff',
    borderWidth: 2,
    borderColor: '#3182ce',
    shadowColor: '#3182ce',
    shadowOpacity: 0.12,
    elevation: 4,
  },
  level: { fontWeight: 'bold', fontSize: 18, marginBottom: 8 },
  currentText: { color: '#3182ce' },
  perks: { marginBottom: 8 },
  daily: { fontSize: 13, color: '#888' },
  lockedText: { color: '#aaa', fontSize: 13, marginTop: 8 },
});

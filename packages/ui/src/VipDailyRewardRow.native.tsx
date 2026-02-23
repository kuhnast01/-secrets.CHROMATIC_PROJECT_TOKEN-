import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface VipDailyRewardRowProps {
  reward: string;
  claimed: boolean;
  claimable: boolean;
  onClaim: () => void;
  timer: string;
  onViewLadder: () => void;
}

export function VipDailyRewardRow({ reward, claimed, claimable, onClaim, timer, onViewLadder }: VipDailyRewardRowProps) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>VIP Daily Reward</Text>
        <Text style={styles.reward}>{reward}</Text>
        <Text style={styles.timer}>Next reset: {timer}</Text>
      </View>
      {claimable && !claimed ? (
        <TouchableOpacity style={styles.claimBtn} onPress={onClaim}>
          <Text style={styles.claimBtnText}>Claim</Text>
        </TouchableOpacity>
      ) : claimed ? (
        <Text style={styles.claimed}>Claimed</Text>
      ) : null}
      <TouchableOpacity style={styles.ladderBtn} onPress={onViewLadder}>
        <Text style={styles.ladderBtnText}>View VIP Ladder</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9', borderRadius: 10, padding: 16, marginVertical: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  title: { fontWeight: 'bold', fontSize: 16 },
  reward: { color: '#3182ce', fontSize: 15, marginVertical: 4 },
  timer: { color: '#888', fontSize: 13 },
  claimBtn: { backgroundColor: '#3182ce', borderRadius: 6, paddingVertical: 8, paddingHorizontal: 18, marginRight: 12 },
  claimBtnText: { color: '#fff', fontWeight: 'bold' },
  claimed: { color: '#4caf50', fontWeight: 'bold', marginRight: 12 },
  ladderBtn: { backgroundColor: 'transparent', borderColor: '#3182ce', borderWidth: 1, borderRadius: 6, paddingVertical: 8, paddingHorizontal: 14 },
  ladderBtnText: { color: '#3182ce' },
});

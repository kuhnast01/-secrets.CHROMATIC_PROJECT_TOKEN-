import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface VipRewardPopupProps {
  reward: string;
  visible: boolean;
  onClose: () => void;
}

export function VipRewardPopup({ reward, visible, onClose }: VipRewardPopupProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={styles.title}>Reward Claimed!</Text>
          <Text style={styles.reward}>{reward}</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  popup: { backgroundColor: '#fff', borderRadius: 16, padding: 40, minWidth: 280, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 8 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  reward: { fontSize: 18, color: '#3182ce', marginBottom: 24 },
  closeBtn: { backgroundColor: '#3182ce', borderRadius: 8, paddingHorizontal: 32, paddingVertical: 10 },
  closeBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

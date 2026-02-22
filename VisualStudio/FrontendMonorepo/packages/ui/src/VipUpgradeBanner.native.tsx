import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { VipPerkList } from './VipPerkList';


interface VipUpgradeBannerProps {
  nextLevel: number;
  nextPerks: string[];
  nextDaily: string;
  onUpgrade: () => void;
  onShowModal: () => void;
  upgrading?: boolean;
}

export function VipUpgradeBanner({ nextLevel, nextPerks, nextDaily, onUpgrade, onShowModal, upgrading }: VipUpgradeBannerProps) {
  return (
    <View style={styles.banner}>
      <Text style={styles.title}>Upgrade to VIP {nextLevel}</Text>
      <View style={styles.perks}><VipPerkList perks={nextPerks} /></View>
      <Text style={styles.daily}>Daily Reward: {nextDaily}</Text>
      <View style={{ flexDirection: 'row', marginTop: 12 }}>
        <TouchableOpacity
          style={[styles.upgradeBtn, upgrading && { opacity: 0.7 }]}
          onPress={onUpgrade}
          disabled={upgrading}
        >
          {upgrading ? (
            <Text style={[styles.upgradeBtnText, { marginRight: 8 }]}>⏳</Text>
          ) : null}
          <Text style={styles.upgradeBtnText}>Upgrade VIP</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.detailsBtn} onPress={onShowModal}>
          <Text style={styles.detailsBtnText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

interface VipUpgradeModalProps {
  visible: boolean;
  nextLevel: number;
  nextPerks: string[];
  nextDaily: string;
  onClose: () => void;
}

export function VipUpgradeModal({ visible, nextLevel, nextPerks, nextDaily, onClose }: VipUpgradeModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>VIP {nextLevel} Benefits</Text>
          <View style={styles.perks}><VipPerkList perks={nextPerks} /></View>
          <Text style={styles.daily}>Daily Reward: {nextDaily}</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  banner: { backgroundColor: '#e6f7ff', borderWidth: 2, borderColor: '#3182ce', borderRadius: 12, padding: 24, marginVertical: 24, alignItems: 'center' },
  title: { fontWeight: 'bold', fontSize: 18, marginBottom: 8 },
  perks: { marginBottom: 8 },
  daily: { color: '#3182ce', fontSize: 15, marginBottom: 8 },
  upgradeBtn: { backgroundColor: '#3182ce', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 32, marginRight: 12 },
  upgradeBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  detailsBtn: { backgroundColor: 'transparent', borderColor: '#3182ce', borderWidth: 1, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 24 },
  detailsBtnText: { color: '#3182ce', fontWeight: 'bold', fontSize: 16 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { backgroundColor: '#fff', borderRadius: 16, padding: 40, minWidth: 280, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 8 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  closeBtn: { backgroundColor: '#3182ce', borderRadius: 8, paddingHorizontal: 32, paddingVertical: 10, marginTop: 16 },
  closeBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

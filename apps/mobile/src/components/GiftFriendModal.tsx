
import React from 'react';
import { Modal, View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

// i18n resource keys required in your translation files:
// {
//   "giftFriendModal": {
//     "header": "Select a Friend",
//     "empty": "No friends found.",
//     "cancel": "Cancel"
//   }
// }

export interface Friend {
  id: string;
  name: string;
}

interface GiftFriendModalProps {
  visible: boolean;
  friends: Friend[];
  onSelect: (friend: Friend) => void;
  onClose: () => void;
}


export default function GiftFriendModal({ visible, friends, onSelect, onClose }: GiftFriendModalProps) {
  const { t } = useTranslation();
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.header}>{t('giftFriendModal.header', 'Select a Friend')}</Text>
          <FlatList
            data={friends}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.friendRow} onPress={() => { onSelect(item); }}>
                <Text style={styles.friendName}>{item.name}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={styles.empty}>{t('giftFriendModal.empty', 'No friends found.')}</Text>}
          />
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>{t('giftFriendModal.cancel', 'Cancel')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modal: { backgroundColor: '#fff', borderRadius: 12, padding: 20, width: 300, maxHeight: 400 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  friendRow: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  friendName: { fontSize: 16 },
  empty: { color: '#888', textAlign: 'center', marginTop: 20 },
  closeBtn: { marginTop: 16, alignSelf: 'center' },
  closeText: { color: '#3182ce', fontWeight: 'bold' },
});

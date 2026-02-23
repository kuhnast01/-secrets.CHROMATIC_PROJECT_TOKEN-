import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePlayer } from '../state/PlayerContext';

// i18n resource keys required in your translation files:
// {
//   "profileHeader": {
//     "frame": "Frame: {{frame}}",
//     "commander": "Commander: {{commander}}",
//     "ship": "Ship: {{ship}}",
//     "guild": "Guild: {{guild}}"
//   }
// }

export default function ProfileHeader({ testID, accessibilityLabel, style }) {
  const { t } = useTranslation();
  const { player } = usePlayer();
  if (!player) return null;
  const equipped = player.equippedCosmetics || {};
  return (
    <View style={[styles.header, style]} testID={testID || 'profile-header'} accessibilityLabel={accessibilityLabel}>
      <View style={styles.avatar}>
        {equipped.frame && <Text style={styles.frame}>{t('profileHeader.frame', { frame: equipped.frame })}</Text>}
        {equipped.commander && <Text style={styles.frame}>{t('profileHeader.commander', { commander: equipped.commander })}</Text>}
        {equipped.ship && <Text style={styles.frame}>{t('profileHeader.ship', { ship: equipped.ship })}</Text>}
        {equipped.guild && <Text style={styles.frame}>{t('profileHeader.guild', { guild: equipped.guild })}</Text>}
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{player.name}</Text>
        {equipped.title && <Text style={styles.title}>{equipped.title}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#f5f5f5', borderRadius: 12, marginBottom: 24 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#ddd', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  frame: { fontSize: 12, color: '#888' },
  info: { flexDirection: 'column' },
  name: { fontSize: 20, fontWeight: 'bold' },
  title: { fontSize: 14, color: '#3182ce' },
});

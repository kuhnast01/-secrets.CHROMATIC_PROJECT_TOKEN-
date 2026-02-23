import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Button, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { equipCosmetic } from '@api';
import { usePlayer } from '../state/PlayerContext';


// i18n resource keys required in your translation files:
// {
//   "cosmeticDetail": {
//     "noSelected": "No cosmetic selected.",
//     "successTitle": "Success",
//     "successMsg": "Cosmetic equipped!",
//     "errorTitle": "Error",
//     "failedEquip": "Failed to equip cosmetic",
//     "networkError": "Network error. Please try again.",
//     "unlock": "Unlock: {{source}}",
//     "owned": "Owned",
//     "unowned": "Unowned",
//     "equipping": "Equipping...",
//     "equip": "Equip",
//     "retry": "Retry",
//     "goToSource": "Go to Source"
//   }
// }

export default function CosmeticDetailScreen({ route, navigation }) {
  const { t } = useTranslation();
  // Assume cosmetic is passed via route params
  const { cosmetic } = route.params || {};

  if (!cosmetic) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error} accessibilityLabel={t('cosmeticDetail.noSelected')} testID="cosmetic-detail-no-selected">
          {t('cosmeticDetail.noSelected')}
        </Text>
      </View>
    );
  }

  const [equipping, setEquipping] = useState(false);
  const [lastEquipError, setLastEquipError] = useState('');
  const { player, setPlayer } = usePlayer();

  const handleEquip = async () => {
    if (equipping) return; // Prevent double submit
    setEquipping(true);
    setLastEquipError('');
    try {
      const result = await equipCosmetic(cosmetic.id);
      if (result.success) {
        Alert.alert(t('cosmeticDetail.successTitle'), t('cosmeticDetail.successMsg'));
        if (player) {
          setPlayer({
            ...player,
            equippedCosmetics: {
              ...(player.equippedCosmetics || {}),
              [cosmetic.type]: cosmetic.id,
            },
          });
        }
      } else {
        setLastEquipError(result.message || t('cosmeticDetail.failedEquip'));
        Alert.alert(t('cosmeticDetail.errorTitle'), result.message || t('cosmeticDetail.failedEquip'));
      }
    } catch (e) {
      setLastEquipError(t('cosmeticDetail.networkError'));
      Alert.alert(t('cosmeticDetail.errorTitle'), t('cosmeticDetail.networkError'));
    } finally {
      setEquipping(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: cosmetic.previewUrl }} style={styles.preview} />
      <Text style={styles.name} accessibilityLabel={cosmetic.name} testID="cosmetic-detail-name">{cosmetic.name}</Text>
      <Text style={styles.rarity} accessibilityLabel={cosmetic.rarity} testID="cosmetic-detail-rarity">{cosmetic.rarity}</Text>
      <Text style={styles.type} accessibilityLabel={cosmetic.type} testID="cosmetic-detail-type">{cosmetic.type}</Text>
      <Text style={styles.unlockSource} accessibilityLabel={t('cosmeticDetail.unlock', { source: cosmetic.unlockSource })} testID="cosmetic-detail-unlock">
        {t('cosmeticDetail.unlock', { source: cosmetic.unlockSource })}
      </Text>
      <Text style={styles.ownership} accessibilityLabel={cosmetic.owned ? t('cosmeticDetail.owned') : t('cosmeticDetail.unowned')} testID="cosmetic-detail-ownership">
        {cosmetic.owned ? t('cosmeticDetail.owned') : t('cosmeticDetail.unowned')}
      </Text>
      {cosmetic.owned ? (
        <>
          <Button
            title={equipping ? t('cosmeticDetail.equipping') : t('cosmeticDetail.equip')}
            onPress={handleEquip}
            disabled={equipping}
            accessibilityLabel={equipping ? t('cosmeticDetail.equipping') : t('cosmeticDetail.equip')}
            testID="cosmetic-detail-equip-btn"
          />
          {lastEquipError ? (
            <Button
              title={t('cosmeticDetail.retry')}
              onPress={handleEquip}
              disabled={equipping}
              color="#e53e3e"
              accessibilityLabel={t('cosmeticDetail.retry')}
              testID="cosmetic-detail-retry-btn"
            />
          ) : null}
        </>
      ) : (
        <Button
          title={t('cosmeticDetail.goToSource')}
          onPress={() => {/* TODO: Route to unlock source */}}
          accessibilityLabel={t('cosmeticDetail.goToSource')}
          testID="cosmetic-detail-go-to-source-btn"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: 24 },
  preview: { width: 180, height: 180, borderRadius: 16, marginBottom: 24, backgroundColor: '#eee' },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  rarity: { fontSize: 16, color: '#888', marginBottom: 4 },
  type: { fontSize: 16, color: '#888', marginBottom: 4 },
  unlockSource: { fontSize: 14, color: '#666', marginBottom: 12 },
  ownership: { fontSize: 16, marginBottom: 16 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  error: { color: 'red', fontSize: 18 },
});

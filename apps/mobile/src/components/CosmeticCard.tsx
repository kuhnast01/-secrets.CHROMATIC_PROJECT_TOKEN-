import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

// i18n resource keys required in your translation files:
// {
//   "cosmeticCard": {
//     "seasonal": "SEASONAL"
//   }
// }

type Cosmetic = {
  id: string | number;
  name: string;
  // Add other properties as needed
};

type CosmeticCardProps = {
  cosmetic: Cosmetic;
  onPress: (cosmetic: Cosmetic) => void;
  highlightSeasonal?: boolean;
  testID?: string;
  accessibilityLabel?: string;
  style?: object;
};

export default function CosmeticCard({
  cosmetic,
  onPress,
  highlightSeasonal,
  testID,
  accessibilityLabel,
  style,
}: CosmeticCardProps) {
  const { t } = useTranslation();
  return (
    <TouchableOpacity
      style={[styles.card, highlightSeasonal ? styles.seasonalCard : null, style]}
      onPress={() => { onPress(cosmetic); }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || cosmetic.name}
      testID={testID || `cosmetic-card-${String(cosmetic.id)}`}
    >
      {/* TODO: Render preview art, rarity, ownership, etc. */}
      <View style={styles.placeholder} />
      {highlightSeasonal && (
        <View style={styles.seasonalBadge}>
          <Text style={styles.seasonalBadgeText}>{t('cosmeticCard.seasonal')}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 100, height: 120, margin: 8, borderRadius: 12, backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  placeholder: {
    width: 80, height: 80, borderRadius: 8, backgroundColor: '#ccc',
  },
  seasonalCard: {
    borderWidth: 2,
    borderColor: '#e67e22',
    backgroundColor: '#fffbe6',
  },
  seasonalBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#e67e22',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 2,
  },
  seasonalBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10,
  },
});

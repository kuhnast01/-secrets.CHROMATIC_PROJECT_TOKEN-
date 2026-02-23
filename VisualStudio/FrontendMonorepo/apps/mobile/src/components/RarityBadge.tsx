import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

// i18n resource keys required in your translation files:
// {
//   "rarityBadge": {
//     "Legendary": "Legendary",
//     "Epic": "Epic",
//     "Rare": "Rare",
//     "Common": "Common"
//   }
// }

/**
 * RarityBadge displays a colored badge for a given rarity string.
 * It is i18n-ready, accessible, and testable.
 * @param rarity Rarity string (e.g., 'Legendary', 'Epic', 'Rare', 'Common')
 * @param testID Optional testID for testing
 * @param accessibilityLabel Optional accessibility label for a11y
 * @param style Optional custom style for badge container
 */
export default function RarityBadge({ rarity, testID, accessibilityLabel, style }) {
  const { t } = useTranslation();
  const color =
    rarity === 'Legendary' ? '#fbbf24' :
      rarity === 'Epic' ? '#a78bfa' :
        rarity === 'Rare' ? '#38bdf8' : '#d1d5db';
  const label = t(`rarityBadge.${rarity}`);
  return (
    <View
      style={[styles.badge, { backgroundColor: color }, style]}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel || label}
      testID={testID || 'rarity-badge'}
    >
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 8 },
  text: { fontSize: 12, fontWeight: 'bold', color: '#222' },
});

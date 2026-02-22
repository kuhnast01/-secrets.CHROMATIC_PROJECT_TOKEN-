
import React from 'react';
import { StyleSheet, FlatList, ActivityIndicator, AccessibilityInfo } from 'react-native';
import { useTranslation } from 'react-i18next';
import CosmeticCard from './CosmeticCard';

// i18n resource keys required in your translation files:
// {
//   "cosmeticsGrid": {
//     "loading": "Loading cosmetics..."
//   }
// }

export default function CosmeticsGrid({ cosmetics, loading, onSelect, highlightSeasonal, testID, accessibilityLabel, style }) {
  const { t } = useTranslation();
  if (loading) {
    return (
      <ActivityIndicator
        style={[styles.loader, style]}
        size="large"
        color="#888"
        accessibilityLabel={t('cosmeticsGrid.loading')}
        testID={testID || 'cosmetics-grid-loading'}
      />
    );
  }
  return (
    <FlatList
      data={cosmetics}
      keyExtractor={item => item.id}
      numColumns={3}
      contentContainerStyle={[styles.grid, style]}
      renderItem={({ item }) => (
        <CosmeticCard cosmetic={item} onPress={onSelect} highlightSeasonal={highlightSeasonal && item.seasonal} />
      )}
      testID={testID || 'cosmetics-grid'}
      accessibilityLabel={accessibilityLabel}
    />
  );
}

const styles = StyleSheet.create({
  grid: { padding: 8 },
  // cardPlaceholder removed, now using CosmeticCard
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
});

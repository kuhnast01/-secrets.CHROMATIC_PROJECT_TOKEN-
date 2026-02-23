import React from 'react';
import { Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Card } from '@ui';
import type { SummonBanner } from '@models';

// i18n resource keys required in your translation files:
// {
//   "bannerCarousel": {
//     "noDescription": "No description."
//   }
// }

interface BannerCarouselProps {
  banners: SummonBanner[];
  onSelect: (banner: SummonBanner) => void;
  selectedBannerId?: string;
  testID?: string;
  accessibilityLabel?: string;
  style?: object;
}

export const BannerCarousel: React.FC<BannerCarouselProps> = ({ banners, onSelect, selectedBannerId, testID, accessibilityLabel, style }) => {
  const { t } = useTranslation();
  return (
    <FlatList
      data={banners}
      horizontal
      keyExtractor={(item) => item.id}
      contentContainerStyle={[styles.carousel, style]}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[styles.banner, selectedBannerId === item.id && styles.selectedBanner]}
          onPress={() => { onSelect(item); }}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel || item.name}
          testID={testID || `banner-carousel-item-${item.id}`}
        >
          <Card title={item.name}>
            <Text style={styles.bannerDesc}>{item.description || t('bannerCarousel.noDescription')}</Text>
          </Card>
        </TouchableOpacity>
      )}
      showsHorizontalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  carousel: { paddingVertical: 8 },
  banner: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#fff',
    minWidth: 180,
  },
  selectedBanner: {
    borderColor: '#3182ce',
    backgroundColor: '#ebf8ff',
  },
  bannerTitle: { fontSize: 16, fontWeight: 'bold' },
  bannerDesc: { fontSize: 13, color: '#555' },
});

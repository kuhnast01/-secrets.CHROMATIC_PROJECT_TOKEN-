import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Card } from '@ui';
import type { SummonBanner } from '@models';

// i18n resource keys required in your translation files:
// {
//   "bannerDetail": {
//     "noDescription": "No description.",
//     "ends": "Ends: {{date}}",
//     "cost": "Cost: {{cost}} {{currency}}",
//     "pity": "Pity: {{current}} / {{max}}",
//     "featuredUnits": "Featured Units:"
//   }
// }

interface BannerDetailProps {
  banner: SummonBanner;
  testID?: string;
  accessibilityLabel?: string;
  style?: object;
}

export const BannerDetail: React.FC<BannerDetailProps> = ({ banner, testID, accessibilityLabel, style }) => {
  const { t, i18n } = useTranslation();
  const endsDate = new Date(banner.endTime);
  const endsLabel = t('bannerDetail.ends', { date: endsDate.toLocaleString(i18n.language) });
  const costLabel = t('bannerDetail.cost', { cost: banner.cost, currency: banner.currency });
  const pityLabel = t('bannerDetail.pity', { current: banner.pity.current, max: banner.pity.max });
  const featuredLabel = t('bannerDetail.featuredUnits');
  const desc = banner.description || t('bannerDetail.noDescription');
  return (
    <Card style={style} testID={testID || 'banner-detail'} accessibilityLabel={accessibilityLabel}>
      <Text style={styles.title}>{banner.name}</Text>
      <Text style={styles.desc}>{desc}</Text>
      <Text style={styles.info}>{endsLabel}</Text>
      <Text style={styles.info}>{costLabel}</Text>
      <Text style={styles.info}>{pityLabel}</Text>
      <Text style={styles.featured}>{featuredLabel}</Text>
      <FlatList
        data={banner.featuredUnits}
        keyExtractor={(item) => item}
        horizontal
        renderItem={({ item }) => (
          <View style={styles.unitBadge}><Text style={styles.unitText}>{item}</Text></View>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  // container: { padding: 16, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginTop: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  desc: { fontSize: 14, color: '#555', marginBottom: 4 },
  info: { fontSize: 13, color: '#888', marginBottom: 2 },
  featured: { fontWeight: 'bold', marginTop: 8, marginBottom: 4 },
  unitBadge: { backgroundColor: '#bee3f8', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginRight: 6 },
  unitText: { fontSize: 13, color: '#2a4365' },
});

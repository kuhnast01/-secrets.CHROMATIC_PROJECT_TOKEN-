
import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { fetchPurchaseHistory, PurchaseHistoryItem } from '@api/src/shopApi';
import { useQuery } from 'react-query';
import { PURCHASE_HISTORY_CONFIG } from '../config/purchaseHistoryConfig';

// i18n resource keys required in your translation files:
// {
//   "purchaseHistoryScreen": {
//     "title": "Purchase History",
//     "error": "Failed to load purchase history.",
//     "empty": "No purchases found.",
//     "dateFormat": "{{date, datetime}}"
//   }
// }


function PurchaseHistoryItemRow({ item }: { item: PurchaseHistoryItem }) {
  const { t } = useTranslation();
  return (
    <View style={styles.row}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.imagePlaceholder} />
      ) : PURCHASE_HISTORY_CONFIG.rowImagePlaceholder ? (
        <Image source={{ uri: PURCHASE_HISTORY_CONFIG.rowImagePlaceholder }} style={styles.imagePlaceholder} />
      ) : (
        <View style={styles.imagePlaceholder} />
      )}
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.rarity}>{item.rarity}</Text>
        <Text style={styles.price}>{item.price} {item.currency}</Text>
        <Text style={styles.date}>{t('purchaseHistoryScreen.dateFormat', { date: new Date(item.purchasedAt) })}</Text>
      </View>
    </View>
  );
}


export default function PurchaseHistoryScreen() {
  const { t } = useTranslation();
  const { data, isLoading, error } = useQuery<PurchaseHistoryItem[]>('purchaseHistory', fetchPurchaseHistory);

  if (isLoading) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }
  if (error) {
    return <Text style={styles.error}>{t('purchaseHistoryScreen.error', 'Failed to load purchase history.')}</Text>;
  }
  if (!data || data.length === 0) {
    return <Text style={styles.empty}>{t('purchaseHistoryScreen.empty', 'No purchases found.')}</Text>;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t('purchaseHistoryScreen.title', 'Purchase History')}</Text>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <PurchaseHistoryItemRow item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, backgroundColor: '#f7f7f7', borderRadius: 8, padding: 12 },
  imagePlaceholder: { width: 48, height: 48, backgroundColor: '#e0e0e0', borderRadius: 8, marginRight: 12 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold' },
  rarity: { fontSize: 14, color: '#888' },
  price: { fontSize: 14, color: '#3182ce' },
  date: { fontSize: 12, color: '#aaa' },
  error: { color: 'red', marginTop: 40, textAlign: 'center' },
  empty: { color: '#888', marginTop: 40, textAlign: 'center' },
});

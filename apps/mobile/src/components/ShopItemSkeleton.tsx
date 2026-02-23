import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function ShopItemSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.image} />
      <View style={styles.info}>
        <View style={styles.lineShort} />
        <View style={styles.lineMedium} />
        <View style={styles.lineShort} />
        <View style={styles.button} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    opacity: 0.7,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  lineShort: {
    width: 80,
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    marginBottom: 8,
  },
  lineMedium: {
    width: 140,
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    marginBottom: 8,
  },
  button: {
    width: 100,
    height: 24,
    backgroundColor: '#d0d0d0',
    borderRadius: 8,
    marginTop: 8,
  },
});

import React from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';

export type CardProps = {
  children: React.ReactNode;
  title?: string;
};

export const Card: React.FC<CardProps> = ({ children, title }) => {
  if (Platform.OS === 'web') {
    return (
      <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, margin: 8 }}>
        {title && <h2 style={{ marginBottom: 8 }}>{title}</h2>}
        {children}
      </div>
    );
  }
  return (
    <View style={styles.card}>
      {title && <Text style={styles.title}>{title}</Text>}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    margin: 8,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

import React from 'react';
import { Platform, TouchableOpacity, Text, StyleSheet, View } from 'react-native';

export type ButtonProps = {
  title: string;
  onPress?: () => void;
  color?: string;
};

export const Button: React.FC<ButtonProps> = ({ title, onPress, color }) => {
  if (Platform.OS === 'web') {
    return (
      <button style={{ backgroundColor: color || '#007bff', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: 4 }} onClick={onPress}>
        {title}
      </button>
    );
  }
  return (
    <TouchableOpacity style={[styles.button, !!color && { backgroundColor: color }]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

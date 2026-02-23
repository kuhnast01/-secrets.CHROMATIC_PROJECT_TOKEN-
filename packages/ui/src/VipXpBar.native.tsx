import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface VipXpBarProps {
  currentXp: number;
  nextLevelXp: number;
  animate?: boolean;
}

export function VipXpBar({ currentXp, nextLevelXp, animate }: VipXpBarProps) {
  const percent = Math.min(100, (currentXp / nextLevelXp) * 100);
  const widthAnim = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    if (animate) {
      Animated.timing(widthAnim, {
        toValue: percent,
        duration: 700,
        useNativeDriver: false,
      }).start();
    } else {
      widthAnim.setValue(percent);
    }
  }, [percent, animate]);
  return (
    <View style={{ marginVertical: 12 }}>
      <Text style={styles.xpText}>XP: {currentXp} / {nextLevelXp}</Text>
      <View style={styles.xpBarBg}>
        <Animated.View style={[styles.xpBarFill, { width: widthAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  xpText: { fontSize: 14, color: '#666' },
  xpBarBg: { backgroundColor: '#eee', borderRadius: 8, height: 16, width: '100%', marginTop: 4, overflow: 'hidden' },
  xpBarFill: { backgroundColor: '#3182ce', height: '100%', borderRadius: 8, position: 'absolute', left: 0, top: 0 },
});

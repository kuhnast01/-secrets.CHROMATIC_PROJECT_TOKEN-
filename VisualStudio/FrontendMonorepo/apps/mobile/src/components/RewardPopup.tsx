
import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image } from 'react-native';
import { useTranslation } from 'react-i18next';

// i18n resource keys required in your translation files:
// {
//   "rewardPopup": {
//     "rarity": {
//       "common": "Common",
//       "rare": "Rare",
//       "epic": "Epic",
//       "legendary": "Legendary",
//       "mythic": "Mythic"
//     },
//     "continue": "Continue"
//   }
// }

export interface RewardPopupProps {
  visible: boolean;
  imageUrl?: string;
  name: string;
  amount: number;
  rarity: string;
  onContinue: () => void;
  description?: string;
}


export const RewardPopup: React.FC<RewardPopupProps> = ({
  visible,
  imageUrl,
  name,
  amount,
  rarity,
  onContinue,
  description,
}) => {
  const { t } = useTranslation();
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const imageScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      // Animate overlay, popup, and image with bounce/overshoot
      Animated.parallel([
        Animated.timing(overlayOpacity, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1.08, friction: 5, tension: 120, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start(() => {
        Animated.spring(scale, { toValue: 1, friction: 6, tension: 100, useNativeDriver: true }).start();
        Animated.spring(imageScale, { toValue: 1, friction: 5, tension: 120, useNativeDriver: true }).start();
      });
      imageScale.setValue(0.8);
    } else {
      Animated.parallel([
        Animated.timing(overlayOpacity, { toValue: 0, duration: 120, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.8, duration: 150, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(imageScale, { toValue: 0.8, duration: 120, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}> 
      <Animated.View style={[styles.popup, { transform: [{ scale }], opacity }]}> 
        {imageUrl && (
          <Animated.Image source={{ uri: imageUrl }} style={[styles.image, { transform: [{ scale: imageScale }] }]} />
        )}
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.amount}>x{amount}</Text>
        <Text style={styles.rarity}>{t(`rewardPopup.rarity.${rarity}`, rarity.charAt(0).toUpperCase() + rarity.slice(1))}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
        <TouchableOpacity onPress={onContinue} style={styles.button}>
          <Text style={styles.buttonText}>{t('rewardPopup.continue', 'Continue')}</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  popup: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    elevation: 8,
    minWidth: 260,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#eee',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#222',
  },
  amount: {
    fontSize: 18,
    color: '#3182ce',
    marginBottom: 4,
  },
  rarity: {
    fontSize: 15,
    color: '#888',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3182ce',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 32,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

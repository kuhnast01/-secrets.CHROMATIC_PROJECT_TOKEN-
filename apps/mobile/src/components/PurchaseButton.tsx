import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

// i18n resource keys required in your translation files:
// {
//   "purchaseButton": {
//     "buyFor": "Buy for {{price}}",
//     "gems": "💎",
//     "gold": "🪙",
//     "seasonal": "🎟️",
//     "prestige": "🏅",
//     "default": "💰"
//   }
// }

export interface PurchaseButtonProps {
  onPress: () => void;
  disabled?: boolean;
  price: number;
  currency: string;
  testID?: string;
  accessibilityLabel?: string;
  style?: object;
}

export const PurchaseButton: React.FC<PurchaseButtonProps> = ({ onPress, disabled, price, currency, testID, accessibilityLabel, style }) => {
  const { t } = useTranslation();
  const icon = t(`purchaseButton.${currency}`, { defaultValue: t('purchaseButton.default') });
  const label = t('purchaseButton.buyFor', { price });
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled, style]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || `${label} ${icon}`}
      testID={testID || 'purchase-button'}
    >
      <Text style={styles.text}>{label} {icon}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3182ce',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#b0b0b0',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

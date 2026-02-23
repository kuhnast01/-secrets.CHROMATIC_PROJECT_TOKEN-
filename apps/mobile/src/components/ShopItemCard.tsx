
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import TimerBadge from './TimerBadge';
import { PurchaseButton } from './PurchaseButton';
import { GiftButton } from './GiftButton';

// i18n resource keys required in your translation files:
// {
//   "shopItemCard": {
//     "rarity": {
//       "common": "Common",
//       "rare": "Rare",
//       "epic": "Epic",
//       "legendary": "Legendary",
//       "mythic": "Mythic"
//     },
//     "price": "{{price}} {{currency}}",
//     "purchaseLimit": "Limit: {{limit}}"
//   }
// }

const rarityColors: Record<string, string> = {
  common: '#b0b0b0',
  rare: '#3182ce',
  epic: '#805ad5',
  legendary: '#f6ad55',
  mythic: '#e53e3e',
};


const RarityBadge: React.FC<{ rarity: string }> = ({ rarity }) => {
  const { t } = useTranslation();
  return (
    <View style={[styles.rarityBadge, { backgroundColor: rarityColors[rarity] || '#ddd' }]}> 
      <Text style={styles.rarityBadgeText}>{t(`shopItemCard.rarity.${rarity}`, rarity.charAt(0).toUpperCase() + rarity.slice(1))}</Text>
    </View>
  );
};


export interface ShopItemCardProps {
  name: string;
  rarity: string;
  price: number;
  currency: string;
  imageUrl?: string;
  purchaseLimit?: string;
  disabled?: boolean;
  timer?: string; // ISO string for expiry
  onPurchase?: () => void;
  onGift?: () => void;
}


export const ShopItemCard: React.FC<ShopItemCardProps> = ({
  name,
  rarity,
  price,
  currency,
  imageUrl,
  purchaseLimit,
  disabled,
  timer,
  onPurchase,
  onGift,
}) => {
  const { t } = useTranslation();
  return (
    <View style={[styles.card, disabled && styles.cardDisabled]}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder} />
      )}
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <RarityBadge rarity={rarity} />
        {timer && <TimerBadge expiresAt={timer} />}
        <Text style={styles.price}>{t('shopItemCard.price', { price, currency })}</Text>
        {purchaseLimit && <Text style={styles.limit}>{t('shopItemCard.purchaseLimit', { limit: purchaseLimit })}</Text>}
        <PurchaseButton
          onPress={onPurchase || (() => {})}
          disabled={disabled}
          price={price}
          currency={currency}
        />
        <GiftButton
          onPress={onGift || (() => {})}
          disabled={disabled}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    opacity: 1,
  },
  cardDisabled: {
    opacity: 0.5,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#eee',
    marginRight: 16,
  },
  imagePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#eee',
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  rarityBadge: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 4,
    marginTop: 2,
  },
  rarityBadgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  price: {
    fontSize: 15,
    color: '#222',
    marginBottom: 2,
  },
  limit: {
    fontSize: 13,
    color: '#3182ce',
  },
});

import React from 'react';
export interface ShopItemCardProps {
    name: string;
    rarity: string;
    price: number;
    currency: string;
    imageUrl?: string;
    purchaseLimit?: string;
    disabled?: boolean;
    timer?: string;
    onPurchase?: () => void;
    onGift?: () => void;
}
export declare const ShopItemCard: React.FC<ShopItemCardProps>;
//# sourceMappingURL=ShopItemCard.d.ts.map
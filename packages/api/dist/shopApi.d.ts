import type { PurchaseResponse } from '../../models/src/shop.zod';
export type { PurchaseResponse };
export interface GiftShopItemRequest {
    itemId: string;
    tab: string;
    recipientId: string;
}
export interface GiftShopItemResponse {
    success: boolean;
    newBalance: number;
    reward: {
        id: string;
        name: string;
        amount: number;
        rarity: string;
        imageUrl?: string;
    };
    error?: string;
}
/**
 * Gift a shop item to a friend
 */
export declare function giftShopItem(req: GiftShopItemRequest): Promise<GiftShopItemResponse>;
export interface PurchaseHistoryItem {
    id: string;
    itemId: string;
    name: string;
    rarity: string;
    price: number;
    currency: string;
    imageUrl?: string;
    purchasedAt: string;
}
export type PurchaseHistoryResponse = PurchaseHistoryItem[];
/**
 * Fetch the user's purchase history
 */
export declare function fetchPurchaseHistory(): Promise<PurchaseHistoryResponse>;
export interface PurchaseRequest {
    itemId: string;
    tab: string;
}
export declare function purchaseShopItem(req: PurchaseRequest): Promise<PurchaseResponse>;
export interface ShopItem {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    imageUrl?: string;
    type: string;
    available: boolean;
    timer?: string;
}
export interface ShopResponse {
    featured: ShopItem[];
    seasonal: ShopItem[];
    arena: ShopItem[];
    raid: ShopItem[];
    guild: ShopItem[];
    faction: ShopItem[];
}
export declare function fetchShop(): Promise<ShopResponse>;
export declare function fetchShopTab(tab: keyof ShopResponse): Promise<ShopItem[]>;
//# sourceMappingURL=shopApi.d.ts.map
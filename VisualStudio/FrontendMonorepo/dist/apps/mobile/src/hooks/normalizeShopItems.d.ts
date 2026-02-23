import { ShopItem } from '@api/src/shopApi';
export type NormalizedShopItem = ShopItem & {
    limit?: number;
    purchased?: number;
};
/**
 * Normalize an array of shop items to ensure all required fields exist.
 * Adds default values for missing fields (limit, purchased, etc.)
 */
export declare function normalizeShopItems(items: ShopItem[]): NormalizedShopItem[];

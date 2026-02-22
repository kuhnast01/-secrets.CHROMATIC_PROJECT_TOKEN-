import { ShopItem } from '@api/src/shopApi';

// Extend ShopItem with optional limit/purchased for normalization
export type NormalizedShopItem = ShopItem & {
  limit?: number;
  purchased?: number;
};

/**
 * Normalize an array of shop items to ensure all required fields exist.
 * Adds default values for missing fields (limit, purchased, etc.)
 */
export function normalizeShopItems(items: ShopItem[]): NormalizedShopItem[] {
  return items.map(item => ({
    ...item,
    // Default limit/purchased to undefined if not present
    limit: typeof (item as any).limit === 'number' ? (item as any).limit : undefined,
    purchased: typeof (item as any).purchased === 'number' ? (item as any).purchased : undefined,
  }));
}

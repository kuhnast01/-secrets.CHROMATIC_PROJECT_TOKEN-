import { apiClient } from './index';
import { ShopItemSchema, ShopResponseSchema, PurchaseResponseSchema } from '../../models/src/shop.zod';
import type { PurchaseResponse } from '../../models/src/shop.zod';

export type { PurchaseResponse };
// --- Gift to Friend ---
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
export async function giftShopItem(req: GiftShopItemRequest): Promise<GiftShopItemResponse> {
  const { data } = await apiClient.post<GiftShopItemResponse>('/shop/gift', req);
  return data;
}
// --- Purchase History ---
export interface PurchaseHistoryItem {
  id: string;
  itemId: string;
  name: string;
  rarity: string;
  price: number;
  currency: string;
  imageUrl?: string;
  purchasedAt: string; // ISO date string
}

export type PurchaseHistoryResponse = PurchaseHistoryItem[];

/**
 * Fetch the user's purchase history
 */
export async function fetchPurchaseHistory(): Promise<PurchaseHistoryResponse> {
  const { data } = await apiClient.get<PurchaseHistoryResponse>('/shop/purchase-history');
  return data;
}
// Purchase API
export interface PurchaseRequest {
  itemId: string;
  tab: string;
}

export async function purchaseShopItem(req: PurchaseRequest): Promise<PurchaseResponse> {
  const { data } = await apiClient.post<PurchaseResponse>('/shop/purchase', req);
  return PurchaseResponseSchema.parse(data);
}

// Types for shop items and shop response
export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl?: string;
  type: string; // e.g. 'featured', 'seasonal', etc.
  available: boolean;
  timer?: string; // ISO string for expiry (optional)
}

export interface ShopResponse {
  featured: ShopItem[];
  seasonal: ShopItem[];
  arena: ShopItem[];
  raid: ShopItem[];
  guild: ShopItem[];
  faction: ShopItem[];
}

// Fetch all shop tabs in one call (can be split later)
export async function fetchShop(): Promise<ShopResponse> {
  const { data } = await apiClient.get<ShopResponse>('/shop');
  return ShopResponseSchema.parse(data);
}

// Fetch a single tab (optional, for future granularity)
export async function fetchShopTab(tab: keyof ShopResponse): Promise<ShopItem[]> {
  const { data } = await apiClient.get<ShopItem[]>(`/shop/${tab}`);
  return data.map(item => ShopItemSchema.parse(item));
}

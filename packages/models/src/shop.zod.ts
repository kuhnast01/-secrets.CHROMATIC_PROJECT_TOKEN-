import { z } from 'zod';

export const ShopItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  currency: z.string(),
  imageUrl: z.string().optional(),
  type: z.string(),
  available: z.boolean(),
  timer: z.string().optional(),
});

export const ShopResponseSchema = z.object({
  featured: z.array(ShopItemSchema),
  seasonal: z.array(ShopItemSchema),
  arena: z.array(ShopItemSchema),
  raid: z.array(ShopItemSchema),
  guild: z.array(ShopItemSchema),
  faction: z.array(ShopItemSchema),
});

export type ShopItem = z.infer<typeof ShopItemSchema>;
export type ShopResponse = z.infer<typeof ShopResponseSchema>;

export const PurchaseResponseSchema = z.object({
  success: z.boolean(),
  newBalance: z.number(),
  newLimit: z.number(),
  reward: z.object({
    id: z.string(),
    name: z.string(),
    amount: z.number(),
    rarity: z.string(),
    imageUrl: z.string().optional(),
  }),
  error: z.string().optional(),
});

export type PurchaseResponse = z.infer<typeof PurchaseResponseSchema>;

export const GiftShopItemResponseSchema = z.object({
  success: z.boolean(),
  newBalance: z.number(),
  reward: z.object({
    id: z.string(),
    name: z.string(),
    amount: z.number(),
    rarity: z.string(),
    imageUrl: z.string().optional(),
  }),
  error: z.string().optional(),
});

export type GiftShopItemResponse = z.infer<typeof GiftShopItemResponseSchema>;

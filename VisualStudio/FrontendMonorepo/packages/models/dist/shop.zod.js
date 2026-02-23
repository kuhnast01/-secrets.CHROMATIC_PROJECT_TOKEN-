"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiftShopItemResponseSchema = exports.PurchaseResponseSchema = exports.ShopResponseSchema = exports.ShopItemSchema = void 0;
const zod_1 = require("zod");
exports.ShopItemSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    price: zod_1.z.number(),
    currency: zod_1.z.string(),
    imageUrl: zod_1.z.string().optional(),
    type: zod_1.z.string(),
    available: zod_1.z.boolean(),
    timer: zod_1.z.string().optional(),
});
exports.ShopResponseSchema = zod_1.z.object({
    featured: zod_1.z.array(exports.ShopItemSchema),
    seasonal: zod_1.z.array(exports.ShopItemSchema),
    arena: zod_1.z.array(exports.ShopItemSchema),
    raid: zod_1.z.array(exports.ShopItemSchema),
    guild: zod_1.z.array(exports.ShopItemSchema),
    faction: zod_1.z.array(exports.ShopItemSchema),
});
exports.PurchaseResponseSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    newBalance: zod_1.z.number(),
    newLimit: zod_1.z.number(),
    reward: zod_1.z.object({
        id: zod_1.z.string(),
        name: zod_1.z.string(),
        amount: zod_1.z.number(),
        rarity: zod_1.z.string(),
        imageUrl: zod_1.z.string().optional(),
    }),
    error: zod_1.z.string().optional(),
});
exports.GiftShopItemResponseSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    newBalance: zod_1.z.number(),
    reward: zod_1.z.object({
        id: zod_1.z.string(),
        name: zod_1.z.string(),
        amount: zod_1.z.number(),
        rarity: zod_1.z.string(),
        imageUrl: zod_1.z.string().optional(),
    }),
    error: zod_1.z.string().optional(),
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SummonBannerSchema = exports.PitySchema = void 0;
const zod_1 = require("zod");
exports.PitySchema = zod_1.z.object({
    current: zod_1.z.number(),
    max: zod_1.z.number(),
});
exports.SummonBannerSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    artUrl: zod_1.z.string(),
    featuredUnits: zod_1.z.array(zod_1.z.string()),
    cost: zod_1.z.number(),
    currency: zod_1.z.string(),
    endTime: zod_1.z.string(),
    pity: exports.PitySchema,
});

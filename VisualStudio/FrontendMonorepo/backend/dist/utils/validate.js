"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = exports.eventSchema = void 0;
const zod_1 = require("zod");
exports.eventSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    config: zod_1.z.any(),
    created_by: zod_1.z.number().optional(),
});
exports.userSchema = zod_1.z.object({
    username: zod_1.z.string().min(1),
    password: zod_1.z.string().min(6),
    role: zod_1.z.string().min(1),
});

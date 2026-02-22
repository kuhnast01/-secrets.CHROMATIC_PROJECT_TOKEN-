"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = getAllUsers;
exports.getAllUserSummaries = getAllUserSummaries;
exports.getUserByUsername = getUserByUsername;
const prisma_1 = __importDefault(require("../prisma"));
async function getAllUsers({ skip = 0, take = 20 } = {}) {
    return prisma_1.default.user.findMany({
        skip,
        take,
        orderBy: { id: 'desc' },
    });
}
async function getAllUserSummaries() {
    return prisma_1.default.user.findMany({
        select: { id: true, username: true, role: true },
    });
}
async function getUserByUsername(username) {
    return prisma_1.default.user.findUnique({
        where: { username },
    });
}

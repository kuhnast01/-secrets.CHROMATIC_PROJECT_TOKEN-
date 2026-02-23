"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuditLogs = getAuditLogs;
const prisma_1 = __importDefault(require("../prisma"));
async function getAuditLogs() {
    return prisma_1.default.auditLog.findMany({
        orderBy: { timestamp: 'desc' },
    });
}

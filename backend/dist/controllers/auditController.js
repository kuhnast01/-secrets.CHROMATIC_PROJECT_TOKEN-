"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAudit = getAudit;
const auditModel_1 = require("../models/auditModel");
const logger_1 = __importDefault(require("../utils/logger"));
// GET /audit - List audit logs (admin/auditor)
async function getAudit(req, res) {
    try {
        const logs = await (0, auditModel_1.getAuditLogs)();
        res.json(logs);
    }
    catch (err) {
        logger_1.default.error({ err }, 'Failed to fetch audit logs');
        res.status(500).json({ error: 'Failed to fetch audit logs' });
    }
}

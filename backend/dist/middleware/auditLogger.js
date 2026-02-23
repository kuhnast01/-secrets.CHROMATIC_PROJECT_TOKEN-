"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogger = auditLogger;
const logger_1 = __importDefault(require("../utils/logger"));
function auditLogger(req, res, next) {
    if (req.path === '/healthz' || req.path === '/system-health') {
        return next();
    }
    // In production, log user, action, and details to DB
    logger_1.default.info({
        user: req.user?.id,
        method: req.method,
        path: req.path,
        body: req.body,
    }, 'Audit log');
    next();
}

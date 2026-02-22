"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.limiter = exports.securityHeaders = void 0;
exports.require2FA = require2FA;
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.securityHeaders = (0, helmet_1.default)();
exports.limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.path === '/healthz' || req.path === '/system-health',
});
// Example 2FA stub middleware
function require2FA(req, res, next) {
    // In production, check user 2FA status here
    next();
}

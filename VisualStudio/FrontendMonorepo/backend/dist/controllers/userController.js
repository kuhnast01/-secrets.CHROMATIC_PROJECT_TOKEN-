"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
const userModel_1 = require("../models/userModel");
const logger_1 = __importDefault(require("../utils/logger"));
// GET /users - List all users (admin only)
async function getUsers(req, res) {
    try {
        const users = await (0, userModel_1.getAllUsers)();
        res.json(users);
    }
    catch (err) {
        logger_1.default.error({ err }, 'Failed to fetch users');
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}

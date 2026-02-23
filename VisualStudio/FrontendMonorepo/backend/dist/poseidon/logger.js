"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logPoseidonRequest = logPoseidonRequest;
exports.getPoseidonRequestHistory = getPoseidonRequestHistory;
// Simple logging and request history for Poseidon
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const LOG_FILE = path_1.default.resolve(__dirname, '../../poseidon_request_history.log');
async function logPoseidonRequest(data) {
    const entry = {
        timestamp: new Date().toISOString(),
        ...data,
    };
    const line = JSON.stringify(entry) + '\n';
    await promises_1.default.appendFile(LOG_FILE, line, 'utf-8');
}
async function getPoseidonRequestHistory(limit = 100) {
    try {
        const content = await promises_1.default.readFile(LOG_FILE, 'utf-8');
        const lines = content.trim().split('\n');
        return lines.slice(-limit).map(line => JSON.parse(line));
    }
    catch {
        return [];
    }
}

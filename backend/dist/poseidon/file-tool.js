"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalFileTool = void 0;
// File tool implementation for Poseidon agent
const promises_1 = __importDefault(require("fs/promises"));
class LocalFileTool {
    async readFile(filePath) {
        return promises_1.default.readFile(filePath, 'utf-8');
    }
    async writeFile(filePath, content) {
        await promises_1.default.writeFile(filePath, content, 'utf-8');
    }
    async createFile(filePath, content = '') {
        await promises_1.default.writeFile(filePath, content, { flag: 'wx' });
    }
    async deleteFile(filePath) {
        await promises_1.default.unlink(filePath);
    }
    async moveFile(src, dest) {
        await promises_1.default.rename(src, dest);
    }
    async createFolder(folderPath) {
        await promises_1.default.mkdir(folderPath, { recursive: true });
    }
}
exports.LocalFileTool = LocalFileTool;

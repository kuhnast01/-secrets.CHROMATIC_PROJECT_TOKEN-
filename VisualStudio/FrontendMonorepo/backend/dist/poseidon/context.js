"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectFileContext = injectFileContext;
// Utility for context injection (file content only)
const promises_1 = __importDefault(require("fs/promises"));
/**
 * Reads the content of a file for context injection.
 * @param filePath Absolute or relative path to the file.
 * @returns File content as string, or throws error if not found.
 */
async function injectFileContext(filePath) {
    try {
        const content = await promises_1.default.readFile(filePath, 'utf-8');
        return content;
    }
    catch (err) {
        throw new Error(`Failed to read file: ${filePath}`);
    }
}

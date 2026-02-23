"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crawlAndIndexRepo = crawlAndIndexRepo;
// Code indexer and repo crawler for Poseidon
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
/**
 * Recursively crawls a directory and indexes code files.
 * @param rootDir The root directory to crawl.
 * @param exts Array of file extensions to include (e.g., ['.ts', '.js', '.tsx', '.jsx']).
 * @returns Array of IndexedFile objects.
 */
async function crawlAndIndexRepo(rootDir, exts = ['.ts', '.js', '.tsx', '.jsx']) {
    const results = [];
    async function walk(dir) {
        const entries = await promises_1.default.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path_1.default.join(dir, entry.name);
            if (entry.isDirectory()) {
                if (['node_modules', 'dist', 'build', '.git'].includes(entry.name))
                    continue;
                await walk(fullPath);
            }
            else if (exts.includes(path_1.default.extname(entry.name))) {
                const content = await promises_1.default.readFile(fullPath, 'utf-8');
                results.push({ filePath: fullPath, content });
            }
        }
    }
    await walk(rootDir);
    return results;
}

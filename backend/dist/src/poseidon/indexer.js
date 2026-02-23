// Code indexer and repo crawler for Poseidon
import fs from 'fs/promises';
import path from 'path';
/**
 * Recursively crawls a directory and indexes code files.
 * @param rootDir The root directory to crawl.
 * @param exts Array of file extensions to include (e.g., ['.ts', '.js', '.tsx', '.jsx']).
 * @returns Array of IndexedFile objects.
 */
export async function crawlAndIndexRepo(rootDir, exts = ['.ts', '.js', '.tsx', '.jsx']) {
    const results = [];
    async function walk(dir) {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                if (['node_modules', 'dist', 'build', '.git'].includes(entry.name))
                    continue;
                await walk(fullPath);
            }
            else if (exts.includes(path.extname(entry.name))) {
                const content = await fs.readFile(fullPath, 'utf-8');
                results.push({ filePath: fullPath, content });
            }
        }
    }
    await walk(rootDir);
    return results;
}

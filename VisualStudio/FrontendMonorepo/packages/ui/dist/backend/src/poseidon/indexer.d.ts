export interface IndexedFile {
    filePath: string;
    content: string;
    symbols?: string[];
    imports?: string[];
}
/**
 * Recursively crawls a directory and indexes code files.
 * @param rootDir The root directory to crawl.
 * @param exts Array of file extensions to include (e.g., ['.ts', '.js', '.tsx', '.jsx']).
 * @returns Array of IndexedFile objects.
 */
export declare function crawlAndIndexRepo(rootDir: string, exts?: string[]): Promise<IndexedFile[]>;

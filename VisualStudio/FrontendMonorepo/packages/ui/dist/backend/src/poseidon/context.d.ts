/**
 * Reads the content of a file for context injection.
 * @param filePath Absolute or relative path to the file.
 * @returns File content as string, or throws error if not found.
 */
export declare function injectFileContext(filePath: string): Promise<string>;

// Utility for context injection (file content only)
import fs from 'fs/promises';

/**
 * Reads the content of a file for context injection.
 * @param filePath Absolute or relative path to the file.
 * @returns File content as string, or throws error if not found.
 */
export async function injectFileContext(filePath: string): Promise<string> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return content;
  } catch (err) {
    throw new Error(`Failed to read file: ${filePath}`);
  }
}

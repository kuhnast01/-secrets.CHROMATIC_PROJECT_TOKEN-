/**
 * Generates a mock embedding vector for a string (for demo/testing).
 * Replace with real embedding API for production.
 * @param text The input text to embed.
 * @param dim The embedding dimension (default 384).
 * @returns Array of numbers representing the embedding.
 */
export declare function generateEmbedding(text: string, dim?: number): number[];

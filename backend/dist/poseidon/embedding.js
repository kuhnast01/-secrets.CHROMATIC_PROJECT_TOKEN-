"use strict";
// Embedding generator for Poseidon (mock implementation)
// In production, replace with OpenAI, HuggingFace, or similar API
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEmbedding = generateEmbedding;
const crypto_1 = __importDefault(require("crypto"));
/**
 * Generates a mock embedding vector for a string (for demo/testing).
 * Replace with real embedding API for production.
 * @param text The input text to embed.
 * @param dim The embedding dimension (default 384).
 * @returns Array of numbers representing the embedding.
 */
function generateEmbedding(text, dim = 384) {
    // Simple deterministic hash-based embedding for demo
    const hash = crypto_1.default.createHash('sha256').update(text).digest();
    const arr = Array.from(hash);
    const embedding = [];
    for (let i = 0; i < dim; i++) {
        embedding.push(arr[i % arr.length] / 255);
    }
    return embedding;
}

// Simple in-memory vector database for Poseidon (for demo/testing)
// Replace with a persistent or cloud vector DB for production
export class VectorDatabase {
    constructor() {
        this.records = [];
    }
    add(record) {
        this.records.push(record);
    }
    search(queryEmbedding, topK = 5) {
        // Cosine similarity
        function cosine(a, b) {
            const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
            const normA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
            const normB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));
            return dot / (normA * normB + 1e-8);
        }
        return this.records
            .map(r => ({ ...r, score: cosine(queryEmbedding, r.embedding) }))
            .sort((a, b) => b.score - a.score)
            .slice(0, topK);
    }
    getAll() {
        return this.records;
    }
}

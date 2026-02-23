// Simple in-memory vector database for Poseidon (for demo/testing)
// Replace with a persistent or cloud vector DB for production

export interface VectorRecord {
  id: string;
  embedding: number[];
  meta: Record<string, any>;
}

export class VectorDatabase {
  private records: VectorRecord[] = [];

  add(record: VectorRecord) {
    this.records.push(record);
  }

  search(queryEmbedding: number[], topK = 5): VectorRecord[] {
    // Cosine similarity
    function cosine(a: number[], b: number[]): number {
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

export interface VectorRecord {
    id: string;
    embedding: number[];
    meta: Record<string, any>;
}
export declare class VectorDatabase {
    private records;
    add(record: VectorRecord): void;
    search(queryEmbedding: number[], topK?: number): VectorRecord[];
    getAll(): VectorRecord[];
}

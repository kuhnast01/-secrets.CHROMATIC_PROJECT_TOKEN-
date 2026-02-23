import { VectorDatabase } from './vector-db';
import { IndexedFile } from './indexer';
export declare class PoseidonSearch {
    private vectorDb;
    private fileIndex;
    constructor(vectorDb: VectorDatabase, fileIndex: IndexedFile[]);
    /**
     * Semantic code search by query string.
     * @param query Natural language or code query.
     * @param topK Number of results to return.
     */
    search_code(query: string, topK?: number): import("./vector-db").VectorRecord[];
    /**
     * Find files related to a given file (by embedding similarity).
     * @param filePath Path of the file to find related files for.
     * @param topK Number of related files to return.
     */
    find_related_files(filePath: string, topK?: number): import("./vector-db").VectorRecord[];
}

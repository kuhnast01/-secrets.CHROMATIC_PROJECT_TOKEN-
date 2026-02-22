import { generateEmbedding } from './embedding';
export class PoseidonSearch {
    constructor(vectorDb, fileIndex) {
        this.vectorDb = vectorDb;
        this.fileIndex = fileIndex;
    }
    /**
     * Semantic code search by query string.
     * @param query Natural language or code query.
     * @param topK Number of results to return.
     */
    search_code(query, topK = 5) {
        const embedding = generateEmbedding(query);
        return this.vectorDb.search(embedding, topK);
    }
    /**
     * Find files related to a given file (by embedding similarity).
     * @param filePath Path of the file to find related files for.
     * @param topK Number of related files to return.
     */
    find_related_files(filePath, topK = 5) {
        const file = this.fileIndex.find(f => f.filePath === filePath);
        if (!file)
            return [];
        const embedding = generateEmbedding(file.content);
        return this.vectorDb.search(embedding, topK).filter(r => r.meta.filePath !== filePath);
    }
}

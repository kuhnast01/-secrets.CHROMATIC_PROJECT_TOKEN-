"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoseidonSearch = void 0;
const embedding_1 = require("./embedding");
class PoseidonSearch {
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
        const embedding = (0, embedding_1.generateEmbedding)(query);
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
        const embedding = (0, embedding_1.generateEmbedding)(file.content);
        return this.vectorDb.search(embedding, topK).filter(r => r.meta.filePath !== filePath);
    }
}
exports.PoseidonSearch = PoseidonSearch;

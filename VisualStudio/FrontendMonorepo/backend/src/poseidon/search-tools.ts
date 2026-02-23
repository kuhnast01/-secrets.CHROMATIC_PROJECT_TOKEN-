// Search tools for Poseidon: search_code and find_related_files
import { VectorDatabase } from './vector-db';
import { generateEmbedding } from './embedding';
import { IndexedFile } from './indexer';

export class PoseidonSearch {
  constructor(private vectorDb: VectorDatabase, private fileIndex: IndexedFile[]) {}

  /**
   * Semantic code search by query string.
   * @param query Natural language or code query.
   * @param topK Number of results to return.
   */
  search_code(query: string, topK = 5) {
    const embedding = generateEmbedding(query);
    return this.vectorDb.search(embedding, topK);
  }

  /**
   * Find files related to a given file (by embedding similarity).
   * @param filePath Path of the file to find related files for.
   * @param topK Number of related files to return.
   */
  find_related_files(filePath: string, topK = 5) {
    const file = this.fileIndex.find(f => f.filePath === filePath);
    if (!file) return [];
    const embedding = generateEmbedding(file.content);
    return this.vectorDb.search(embedding, topK).filter(r => r.meta.filePath !== filePath);
  }
}

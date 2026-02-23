// Poseidon backend service entry point
import express from 'express';
import path from 'path';
import { promptTemplates } from './prompts';
import { injectFileContext } from './context';
import { logPoseidonRequest } from './logger';
import { crawlAndIndexRepo } from './indexer';
import { generateEmbedding } from './embedding';
import { VectorDatabase } from './vector-db';
import { PoseidonSearch } from './search-tools';
export async function createPoseidonApp() {
    const app = express();
    app.use(express.json());
    // --- Semantic Search Initialization ---
    const REPO_ROOT = process.env.POSEIDON_REPO_ROOT
        ? path.resolve(process.env.POSEIDON_REPO_ROOT)
        : path.resolve(__dirname, '../../../');
    let poseidonSearch = null;
    const fileIndex = await crawlAndIndexRepo(REPO_ROOT);
    const vectorDb = new VectorDatabase();
    for (const file of fileIndex) {
        const embedding = generateEmbedding(file.content);
        vectorDb.add({ id: file.filePath, embedding, meta: { filePath: file.filePath } });
    }
    poseidonSearch = new PoseidonSearch(vectorDb, fileIndex);
    // /poseidon/query endpoint
    app.post('/poseidon/query', async (req, res) => {
        const { query, fileContent, filePath, error, type } = req.body;
        let injectedContent = fileContent;
        let logData = { query, fileContent, filePath, error, type };
        if (filePath) {
            try {
                injectedContent = await injectFileContext(filePath);
            }
            catch (err) {
                const errorMsg = err instanceof Error ? err.message : String(err);
                await logPoseidonRequest({ ...logData, status: 'error', errorMessage: errorMsg });
                return res.status(400).json({ error: errorMsg });
            }
        }
        let prompt = '';
        switch (type) {
            case 'explain_file':
                prompt = promptTemplates.explain_file(injectedContent);
                break;
            case 'explain_error':
                prompt = promptTemplates.explain_error(error, injectedContent);
                break;
            case 'suggest_improvements':
                prompt = promptTemplates.suggest_improvements(injectedContent);
                break;
            default:
                prompt = 'Unknown query type.';
        }
        const response = {
            message: 'Poseidon prompt generated.',
            type,
            prompt,
        };
        await logPoseidonRequest({ ...logData, status: 'success', response });
        res.json(response);
    });
    // --- Semantic Search Endpoints ---
    app.post('/poseidon/search_code', async (req, res) => {
        if (!poseidonSearch)
            return res.status(503).json({ error: 'Semantic search not initialized.' });
        const { query, topK } = req.body;
        if (!query || typeof query !== 'string' || !query.trim()) {
            return res.status(400).json({ error: 'Query is required and must be a non-empty string.' });
        }
        const results = poseidonSearch.search_code(query, topK || 5);
        res.json({ results });
    });
    app.post('/poseidon/find_related_files', async (req, res) => {
        if (!poseidonSearch)
            return res.status(503).json({ error: 'Semantic search not initialized.' });
        const { filePath, topK } = req.body;
        if (!filePath || typeof filePath !== 'string' || !filePath.trim()) {
            return res.status(400).json({ error: 'filePath is required and must be a non-empty string.' });
        }
        const results = poseidonSearch.find_related_files(filePath, topK || 5);
        res.json({ results });
    });
    return app;
}
// For CLI/server usage
if (require.main === module) {
    (async () => {
        const app = await createPoseidonApp();
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Poseidon service running on port ${port}`);
        });
    })();
}

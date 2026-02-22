"use strict";
// Poseidon backend service entry point
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPoseidonApp = createPoseidonApp;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const prompts_1 = require("./prompts");
const context_1 = require("./context");
const logger_1 = require("./logger");
const indexer_1 = require("./indexer");
const embedding_1 = require("./embedding");
const vector_db_1 = require("./vector-db");
const search_tools_1 = require("./search-tools");
async function createPoseidonApp() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    // --- Semantic Search Initialization ---
    const REPO_ROOT = process.env.POSEIDON_REPO_ROOT
        ? path_1.default.resolve(process.env.POSEIDON_REPO_ROOT)
        : path_1.default.resolve(__dirname, '../../../');
    let poseidonSearch = null;
    const fileIndex = await (0, indexer_1.crawlAndIndexRepo)(REPO_ROOT);
    const vectorDb = new vector_db_1.VectorDatabase();
    for (const file of fileIndex) {
        const embedding = (0, embedding_1.generateEmbedding)(file.content);
        vectorDb.add({ id: file.filePath, embedding, meta: { filePath: file.filePath } });
    }
    poseidonSearch = new search_tools_1.PoseidonSearch(vectorDb, fileIndex);
    // /poseidon/query endpoint
    app.post('/poseidon/query', async (req, res) => {
        const { query, fileContent, filePath, error, type } = req.body;
        let injectedContent = fileContent;
        let logData = { query, fileContent, filePath, error, type };
        if (filePath) {
            try {
                injectedContent = await (0, context_1.injectFileContext)(filePath);
            }
            catch (err) {
                const errorMsg = err instanceof Error ? err.message : String(err);
                await (0, logger_1.logPoseidonRequest)({ ...logData, status: 'error', errorMessage: errorMsg });
                return res.status(400).json({ error: errorMsg });
            }
        }
        let prompt = '';
        switch (type) {
            case 'explain_file':
                prompt = prompts_1.promptTemplates.explain_file(injectedContent);
                break;
            case 'explain_error':
                prompt = prompts_1.promptTemplates.explain_error(error, injectedContent);
                break;
            case 'suggest_improvements':
                prompt = prompts_1.promptTemplates.suggest_improvements(injectedContent);
                break;
            default:
                prompt = 'Unknown query type.';
        }
        const response = {
            message: 'Poseidon prompt generated.',
            type,
            prompt,
        };
        await (0, logger_1.logPoseidonRequest)({ ...logData, status: 'success', response });
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

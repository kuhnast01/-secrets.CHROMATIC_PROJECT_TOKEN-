// Acceptance criteria and tests for Poseidon Sprint 2
/**
 * Acceptance Criteria:
 * 1. Poseidon can answer questions using repo-wide context (semantic search).
 * 2. Poseidon can find related files for any file in the repo.
 * 3. search_code and find_related_files endpoints return relevant results.
 * 4. System handles missing/invalid input gracefully.
 */
import request from 'supertest';
import path from 'path';
import { createPoseidonApp } from './index';
let app;
jest.setTimeout(30000);
beforeAll(async () => {
    process.env.POSEIDON_REPO_ROOT = path.resolve(__dirname, '../..');
    app = await createPoseidonApp();
});
describe('Poseidon Semantic Search', () => {
    it('should return code search results', async () => {
        const res = await request(app)
            .post('/poseidon/search_code')
            .send({ query: 'authentication' });
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.results)).toBe(true);
    });
    it('should return related files', async () => {
        const res = await request(app)
            .post('/poseidon/find_related_files')
            .send({ filePath: __filename });
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.results)).toBe(true);
    });
    it('should handle missing query gracefully', async () => {
        const res = await request(app)
            .post('/poseidon/search_code')
            .send({});
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Query is required and must be a non-empty string.');
    });
    it('should handle missing filePath gracefully', async () => {
        const res = await request(app)
            .post('/poseidon/find_related_files')
            .send({});
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('filePath is required and must be a non-empty string.');
    });
});

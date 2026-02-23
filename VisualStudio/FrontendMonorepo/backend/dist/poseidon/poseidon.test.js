"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
// Acceptance criteria and basic tests for Poseidon MVP Assistant
/**
 * Acceptance Criteria:
 * 1. Poseidon can explain any file you paste into it.
 * 2. Poseidon can suggest improvements for a file.
 * 3. Poseidon can answer architecture questions (via prompt template).
 * 4. No file writes are performed by Poseidon in this sprint.
 * 5. All requests and responses are logged.
 */
require("jest");
const supertest_1 = __importDefault(require("supertest"));
const path_1 = __importDefault(require("path"));
const index_1 = require("./index");
let app;
jest.setTimeout(30000);
beforeAll(async () => {
    process.env.POSEIDON_REPO_ROOT = path_1.default.resolve(__dirname, '../..');
    app = await (0, index_1.createPoseidonApp)();
});
describe('Poseidon MVP Assistant', () => {
    it('should explain a file', async () => {
        const res = await (0, supertest_1.default)(app)
            .post('/poseidon/query')
            .send({
            type: 'explain_file',
            fileContent: 'function add(a, b) { return a + b; }',
        });
        expect(res.status).toBe(200);
        expect(res.body.prompt).toContain('Explain the following file');
    });
    it('should suggest improvements', async () => {
        const res = await (0, supertest_1.default)(app)
            .post('/poseidon/query')
            .send({
            type: 'suggest_improvements',
            fileContent: 'var x = 1;',
        });
        expect(res.status).toBe(200);
        expect(res.body.prompt).toContain('Suggest concrete improvements');
    });
    it('should explain an error', async () => {
        const res = await (0, supertest_1.default)(app)
            .post('/poseidon/query')
            .send({
            type: 'explain_error',
            error: 'ReferenceError: x is not defined',
            fileContent: 'console.log(x);',
        });
        expect(res.status).toBe(200);
        expect(res.body.prompt).toContain('Explain the following error');
    });
    it('should reject unknown query types', async () => {
        const res = await (0, supertest_1.default)(app)
            .post('/poseidon/query')
            .send({ type: 'unknown_type' });
        expect(res.status).toBe(200);
        expect(res.body.prompt).toBe('Unknown query type.');
    });
});

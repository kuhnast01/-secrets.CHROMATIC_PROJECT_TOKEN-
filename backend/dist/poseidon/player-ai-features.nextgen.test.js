"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Tests for next-gen AI features: generative 3D, multi-agent orchestration, custom analytics
const supertest_1 = __importDefault(require("supertest"));
const studio_services_api_1 = __importDefault(require("./studio-services-api"));
describe('Next-Gen AI Features API', () => {
    const userId = 'test-user';
    const headers = { 'x-user-id': userId };
    it('should generate 3D asset', async () => {
        const res = await (0, supertest_1.default)(studio_services_api_1.default)
            .post('/api/player-ai/generative-3d-asset')
            .set(headers)
            .send({ input: { prompt: 'dragon', type: 'character' } });
        expect(res.status).toBe(200);
        expect(res.body.result).toHaveProperty('asset');
    });
    it('should orchestrate multiple agents', async () => {
        const res = await (0, supertest_1.default)(studio_services_api_1.default)
            .post('/api/player-ai/multi-agent-orchestration')
            .set(headers)
            .send({ input: { agents: ['npc1', 'npc2'], task: 'patrol' } });
        expect(res.status).toBe(200);
        expect(res.body.result).toHaveProperty('orchestration');
    });
    it('should run custom analytics', async () => {
        const res = await (0, supertest_1.default)(studio_services_api_1.default)
            .post('/api/player-ai/custom-analytics')
            .set(headers)
            .send({ input: { query: 'SELECT * FROM events' } });
        expect(res.status).toBe(200);
        expect(res.body.result).toHaveProperty('analytics');
    });
});

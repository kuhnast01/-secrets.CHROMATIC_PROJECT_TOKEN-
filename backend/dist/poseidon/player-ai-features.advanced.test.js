"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
// Tests for advanced AI platform features (feedback, explainability, plugin, ethics, resource, collaboration)
require("jest");
const supertest_1 = __importDefault(require("supertest"));
const studio_services_api_1 = __importDefault(require("./studio-services-api"));
describe('Advanced AI Platform Features API', () => {
    const userId = 'test-user';
    const headers = { 'x-user-id': userId };
    it('should accept AI feedback', async () => {
        const res = await (0, supertest_1.default)(studio_services_api_1.default)
            .post('/api/player-ai/ai-feedback')
            .set(headers)
            .send({ input: { featureId: 'npc-dialogue', feedback: 'Great!' } });
        expect(res.status).toBe(200);
        expect(res.body.result).toHaveProperty('received', true);
    });
    it('should provide AI explainability', async () => {
        const res = await (0, supertest_1.default)(studio_services_api_1.default)
            .post('/api/player-ai/ai-explainability')
            .set(headers)
            .send({ input: { featureId: 'npc-dialogue', question: 'Why did the NPC say that?' } });
        expect(res.status).toBe(200);
        expect(res.body.result).toHaveProperty('explanation');
    });
    it('should run AI plugin', async () => {
        const res = await (0, supertest_1.default)(studio_services_api_1.default)
            .post('/api/player-ai/ai-plugin')
            .set(headers)
            .send({ input: { pluginName: 'testPlugin', args: {} } });
        expect(res.status).toBe(200);
        expect(res.body.result).toHaveProperty('plugin', 'testPlugin');
    });
    it('should check AI ethics/privacy', async () => {
        const res = await (0, supertest_1.default)(studio_services_api_1.default)
            .post('/api/player-ai/ai-ethics')
            .set(headers)
            .send({ input: { action: 'check-privacy' } });
        expect(res.status).toBe(200);
        expect(res.body.result).toHaveProperty('status');
    });
    it('should report AI resource awareness', async () => {
        const res = await (0, supertest_1.default)(studio_services_api_1.default)
            .post('/api/player-ai/ai-resource-awareness')
            .set(headers)
            .send({ input: { task: 'heavy-compute' } });
        expect(res.status).toBe(200);
        expect(res.body.result).toHaveProperty('resources');
    });
    it('should initiate AI collaboration', async () => {
        const res = await (0, supertest_1.default)(studio_services_api_1.default)
            .post('/api/player-ai/ai-collaboration')
            .set(headers)
            .send({ input: { agents: ['agent1', 'agent2'] } });
        expect(res.status).toBe(200);
        expect(res.body.result).toHaveProperty('status');
    });
});

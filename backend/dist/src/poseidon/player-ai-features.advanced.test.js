import 'jest';
// Tests for advanced AI platform features (feedback, explainability, plugin, ethics, resource, collaboration)
import 'jest';
import request from 'supertest';
import app from './studio-services-api';
describe('Advanced AI Platform Features API', () => {
    const userId = 'test-user';
    const headers = { 'x-user-id': userId };
    it('should accept AI feedback', async () => {
        const res = await request(app)
            .post('/api/player-ai/ai-feedback')
            .set(headers)
            .send({ input: { featureId: 'npc-dialogue', feedback: 'Great!' } });
        expect(res.status).toBe(200);
        expect(res.body.result).toHaveProperty('received', true);
    });
    it('should provide AI explainability', async () => {
        const res = await request(app)
            .post('/api/player-ai/ai-explainability')
            .set(headers)
            .send({ input: { featureId: 'npc-dialogue', question: 'Why did the NPC say that?' } });
        expect(res.status).toBe(200);
        expect(res.body.result).toHaveProperty('explanation');
    });
    it('should run AI plugin', async () => {
        const res = await request(app)
            .post('/api/player-ai/ai-plugin')
            .set(headers)
            .send({ input: { pluginName: 'testPlugin', args: {} } });
        expect(res.status).toBe(200);
        expect(res.body.result).toHaveProperty('plugin', 'testPlugin');
    });
    it('should check AI ethics/privacy', async () => {
        const res = await request(app)
            .post('/api/player-ai/ai-ethics')
            .set(headers)
            .send({ input: { action: 'check-privacy' } });
        expect(res.status).toBe(200);
        expect(res.body.result).toHaveProperty('status');
    });
    it('should report AI resource awareness', async () => {
        const res = await request(app)
            .post('/api/player-ai/ai-resource-awareness')
            .set(headers)
            .send({ input: { task: 'heavy-compute' } });
        expect(res.status).toBe(200);
        expect(res.body.result).toHaveProperty('resources');
    });
    it('should initiate AI collaboration', async () => {
        const res = await request(app)
            .post('/api/player-ai/ai-collaboration')
            .set(headers)
            .send({ input: { agents: ['agent1', 'agent2'] } });
        expect(res.status).toBe(200);
        expect(res.body.result).toHaveProperty('status');
    });
});

// Tests for next-gen AI features: generative 3D, multi-agent orchestration, custom analytics
import request from 'supertest';
import app from './studio-services-api';
describe('Next-Gen AI Features API', () => {
    const userId = 'test-user';
    const headers = { 'x-user-id': userId };
    it('should generate 3D asset', async () => {
        const res = await request(app)
            .post('/api/player-ai/generative-3d-asset')
            .set(headers)
            .send({ input: { prompt: 'dragon', type: 'character' } });
        expect(res.status).toBe(200);
        expect(res.body.result).toHaveProperty('asset');
    });
    it('should orchestrate multiple agents', async () => {
        const res = await request(app)
            .post('/api/player-ai/multi-agent-orchestration')
            .set(headers)
            .send({ input: { agents: ['npc1', 'npc2'], task: 'patrol' } });
        expect(res.status).toBe(200);
        expect(res.body.result).toHaveProperty('orchestration');
    });
    it('should run custom analytics', async () => {
        const res = await request(app)
            .post('/api/player-ai/custom-analytics')
            .set(headers)
            .send({ input: { query: 'SELECT * FROM events' } });
        expect(res.status).toBe(200);
        expect(res.body.result).toHaveProperty('analytics');
    });
});

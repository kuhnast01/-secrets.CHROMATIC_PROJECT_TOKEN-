// Tests for Player-Facing AI Features API
import request from 'supertest';
import app from './studio-services-api';
describe('Player-Facing AI Features API', () => {
    const userId = 'test-user';
    const headers = { 'x-user-id': userId };
    it('should run NPC dialogue feature', async () => {
        const res = await request(app)
            .post('/api/player-ai/npc-dialogue')
            .set(headers)
            .send({ input: { prompt: 'Hello, NPC!' } });
        expect(res.status).toBe(200);
        expect(res.body.result.reply).toContain('NPC says:');
        expect(res.body.result.reply).toContain(userId);
    });
    it('should return 404 for unknown feature', async () => {
        const res = await request(app)
            .post('/api/player-ai/unknown-feature')
            .set(headers)
            .send({ input: { prompt: 'Test' } });
        expect(res.status).toBe(404);
    });
});

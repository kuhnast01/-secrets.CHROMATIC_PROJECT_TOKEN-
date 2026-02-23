"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Tests for Player-Facing AI Features API
const supertest_1 = __importDefault(require("supertest"));
const studio_services_api_1 = __importDefault(require("./studio-services-api"));
describe('Player-Facing AI Features API', () => {
    const userId = 'test-user';
    const headers = { 'x-user-id': userId };
    it('should run NPC dialogue feature', async () => {
        const res = await (0, supertest_1.default)(studio_services_api_1.default)
            .post('/api/player-ai/npc-dialogue')
            .set(headers)
            .send({ input: { prompt: 'Hello, NPC!' } });
        expect(res.status).toBe(200);
        expect(res.body.result.reply).toContain('NPC says:');
        expect(res.body.result.reply).toContain(userId);
    });
    it('should return 404 for unknown feature', async () => {
        const res = await (0, supertest_1.default)(studio_services_api_1.default)
            .post('/api/player-ai/unknown-feature')
            .set(headers)
            .send({ input: { prompt: 'Test' } });
        expect(res.status).toBe(404);
    });
});

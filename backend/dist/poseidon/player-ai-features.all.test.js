"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Tests for all Player-Facing AI Features API endpoints
const supertest_1 = __importDefault(require("supertest"));
const studio_services_api_1 = __importDefault(require("./studio-services-api"));
describe('Player-Facing AI Features API (all features)', () => {
    const userId = 'test-user';
    const headers = { 'x-user-id': userId };
    const features = [
        { id: 'npc-dialogue', input: { prompt: 'Hello!' }, expectKey: 'reply' },
        { id: 'personalized-tutorial', input: { progress: 'start' }, expectKey: 'tutorial' },
        { id: 'quest-lore', input: { theme: 'dragons' }, expectKey: 'quest' },
        { id: 'accessibility', input: { text: 'Accessibility test' }, expectKey: 'tts' },
        { id: 'dynamic-difficulty', input: { stats: {} }, expectKey: 'recommendation' },
        { id: 'moderation', input: { message: 'Test message' }, expectKey: 'moderation' },
        { id: 'voice-synthesis', input: { text: 'Speak this' }, expectKey: 'audio' },
        { id: 'in-game-assistant', input: { question: 'How do I win?' }, expectKey: 'answer' },
        { id: 'procedural-content', input: { type: 'level' }, expectKey: 'content' },
        { id: 'real-time-translation', input: { text: 'Hello', targetLang: 'es' }, expectKey: 'translation' },
        { id: 'deep-player-modeling', input: { history: {} }, expectKey: 'model' },
        { id: 'ai-coop-rival', input: { action: 'attack' }, expectKey: 'aiPartner' },
        { id: 'emotional-ai', input: { mood: 'happy' }, expectKey: 'response' },
        { id: 'explainable-ai', input: { question: 'Why did you do that?' }, expectKey: 'explanation' },
        { id: 'community-driven-ai', input: { feedback: 'More dragons!' }, expectKey: 'result' },
        { id: 'liveops-ai', input: { event: 'double-xp' }, expectKey: 'liveops' },
    ];
    features.forEach(({ id, input, expectKey }) => {
        it(`should run feature: ${id}`, async () => {
            const res = await (0, supertest_1.default)(studio_services_api_1.default)
                .post(`/api/player-ai/${id}`)
                .set(headers)
                .send({ input });
            expect(res.status).toBe(200);
            expect(res.body.result).toHaveProperty(expectKey);
        });
    });
});

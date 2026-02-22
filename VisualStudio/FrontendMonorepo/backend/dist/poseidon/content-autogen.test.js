"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
// Phase 3 Pillar 2: Content & LiveOps Auto-Generation tests for Poseidon
require("jest");
const content_autogen_1 = require("./content-autogen");
describe('ContentAutoGenerator', () => {
    let generator;
    beforeEach(() => {
        generator = new content_autogen_1.ContentAutoGenerator();
    });
    it('should auto-generate event config', () => {
        const req = { type: 'event', params: { name: 'Test Event' } };
        const result = generator.generate(req);
        expect(result.content.id).toBe('evt-auto');
        expect(result.summary).toContain('event');
    });
    it('should auto-generate shop rotation', () => {
        const req = { type: 'shop', params: {} };
        const result = generator.generate(req);
        expect(result.content.rotation).toBeDefined();
        expect(result.summary).toContain('shop');
    });
    it('should auto-generate reward table', () => {
        const req = { type: 'reward', params: {} };
        const result = generator.generate(req);
        expect(result.content.table).toBeDefined();
        expect(result.summary).toContain('reward');
    });
    it('should auto-generate seasonal plan', () => {
        const req = { type: 'season', params: {} };
        const result = generator.generate(req);
        expect(result.content.plan).toBe('Spring Plan');
        expect(result.summary).toContain('seasonal');
    });
    it('should auto-generate localization draft', () => {
        const req = { type: 'localization', params: {} };
        const result = generator.generate(req);
        expect(result.content.en).toBe('Hello');
        expect(result.summary).toContain('localization');
    });
    it('should auto-generate patch notes', () => {
        const req = { type: 'patch-notes', params: {} };
        const result = generator.generate(req);
        expect(result.content.notes).toBe('Bug fixes');
        expect(result.summary).toContain('patch notes');
    });
    it('should generate LiveOps calendar', () => {
        const result = generator.generateCalendar([{ id: 1 }, { id: 2 }]);
        expect(result.calendar).toContain('2 events');
    });
});

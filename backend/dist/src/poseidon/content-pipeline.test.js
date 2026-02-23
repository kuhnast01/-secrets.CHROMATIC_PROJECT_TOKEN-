// Phase 2 Pillar 4: Content Pipeline + Seasonal Engine Integration tests for Poseidon
import { ContentPipeline } from './content-pipeline';
describe('ContentPipeline', () => {
    let pipeline;
    beforeEach(() => {
        pipeline = new ContentPipeline();
    });
    it('should validate mission schema with objective', () => {
        const file = { type: 'mission', data: { objective: 'win' } };
        const result = pipeline.validateSchema(file);
        expect(result.valid).toBe(true);
        expect(result.errors.length).toBe(0);
    });
    it('should invalidate mission schema without objective', () => {
        const file = { type: 'mission', data: {} };
        const result = pipeline.validateSchema(file);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Missing mission objective');
    });
    it('should diff content files', () => {
        const oldFile = { type: 'reward', data: { amount: 10 } };
        const newFile = { type: 'reward', data: { amount: 20 } };
        const diff = pipeline.diffContent(oldFile, newFile);
        expect(diff).toBe('Content changed.');
    });
    it('should preview seasonal change', () => {
        const file = { type: 'event', data: { id: 1 } };
        const preview = pipeline.previewSeasonalChange(file, 'Spring');
        expect(preview).toContain('Preview for event in season Spring');
    });
});

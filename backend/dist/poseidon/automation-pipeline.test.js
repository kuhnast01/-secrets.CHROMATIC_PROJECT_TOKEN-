"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Phase 3 Pillar 1: Automation Pipelines tests for Poseidon
const automation_pipeline_1 = require("./automation-pipeline");
describe('AutomationPipeline', () => {
    let pipeline;
    beforeEach(() => {
        pipeline = new automation_pipeline_1.AutomationPipeline();
    });
    it('should prepare PR for lint-fix', async () => {
        const task = { type: 'lint-fix', payload: {}, triggeredBy: 'cron', safeMode: true };
        const result = await pipeline.runTask(task);
        expect(result.prPrepared).toBe(true);
        expect(result.summary).toContain('Lint fixes');
    });
    it('should prepare PR for dependency-bump', async () => {
        const task = { type: 'dependency-bump', payload: {}, triggeredBy: 'cron', safeMode: true };
        const result = await pipeline.runTask(task);
        expect(result.prPrepared).toBe(true);
        expect(result.summary).toContain('Dependency update');
    });
    it('should validate content', async () => {
        const task = { type: 'content-validation', payload: {}, triggeredBy: 'event', safeMode: true };
        const result = await pipeline.runTask(task);
        expect(result.prPrepared).toBe(false);
        expect(result.summary).toContain('Content validated');
    });
    it('should stage LiveOps publish PR', async () => {
        const task = { type: 'liveops-publish', payload: {}, triggeredBy: 'commit', safeMode: true };
        const result = await pipeline.runTask(task);
        expect(result.prPrepared).toBe(true);
        expect(result.summary).toContain('LiveOps publish PR staged');
    });
    it('should trigger automation based on event', () => {
        expect(automation_pipeline_1.AutomationPipeline.shouldTrigger('lint-fix', 'cron')).toBe(true);
        expect(automation_pipeline_1.AutomationPipeline.shouldTrigger('liveops-publish', 'commit')).toBe(true);
        expect(automation_pipeline_1.AutomationPipeline.shouldTrigger('dependency-bump', 'event')).toBe(false);
    });
});

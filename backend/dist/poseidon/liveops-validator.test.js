"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Phase 2 Pillar 2: Admin Panel + LiveOps Integration tests for Poseidon
const liveops_validator_1 = require("./liveops-validator");
describe('LiveOpsValidator', () => {
    let validator;
    beforeEach(() => {
        validator = new liveops_validator_1.LiveOpsValidator();
    });
    it('should validate event config with id', () => {
        const config = { type: 'event', data: { id: 'evt1' } };
        const result = validator.validate(config);
        expect(result.valid).toBe(true);
        expect(result.errors.length).toBe(0);
    });
    it('should invalidate event config without id', () => {
        const config = { type: 'event', data: {} };
        const result = validator.validate(config);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Missing event id');
    });
    it('should simulate event', () => {
        const config = { type: 'event', data: { id: 'evt2' } };
        const sim = validator.simulate(config);
        expect(sim.result).toContain('Simulated event with id evt2');
    });
    it('should predict economy impact', () => {
        const pred = validator.predictEconomyImpact({ change: 1 });
        expect(pred.impact).toBe('neutral');
    });
});

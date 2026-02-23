"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Phase 4 Pillar 2: Studio Services API tests (integration, multi-tenant, standards)
const supertest_1 = __importDefault(require("supertest"));
const studio_services_api_1 = __importDefault(require("./studio-services-api"));
describe('Studio Services API', () => {
    const tenant = 'test-tenant';
    const headers = { 'x-tenant-id': tenant };
    it('should validate LiveOps config', async () => {
        const res = await (0, supertest_1.default)(studio_services_api_1.default)
            .post('/api/liveops/validate')
            .set(headers)
            .send({ type: 'event', data: { id: 'evt1' } });
        expect(res.status).toBe(200);
        // LiveOpsValidator returns { valid: boolean, errors: string[] }
        if (typeof res.body.valid === 'object') {
            expect(res.body.valid.valid).toBe(true);
            expect(Array.isArray(res.body.valid.errors)).toBe(true);
        }
        else {
            expect(res.body.valid).toBe(true);
        }
    });
    it('should validate content schema', async () => {
        const res = await (0, supertest_1.default)(studio_services_api_1.default)
            .post('/api/content/validate')
            .set(headers)
            .send({ type: 'mission', data: { objective: 'win' } });
        expect(res.status).toBe(200);
        expect(res.body.valid).toBe(true);
    });
    it('should ingest and summarize backend logs', async () => {
        await (0, supertest_1.default)(studio_services_api_1.default)
            .post('/api/monitor/ingest')
            .set(headers)
            .send({ timestamp: Date.now(), level: 'error', message: 'fail' });
        const res = await (0, supertest_1.default)(studio_services_api_1.default)
            .post('/api/monitor/summarize')
            .set(headers)
            .send();
        expect(res.status).toBe(200);
        expect(res.body.summary).toContain('Incidents:');
    });
    it('should return 404 for unknown service', async () => {
        const res = await (0, supertest_1.default)(studio_services_api_1.default)
            .post('/api/unknown/validate')
            .set(headers)
            .send({});
        expect(res.status).toBe(404);
    });
});

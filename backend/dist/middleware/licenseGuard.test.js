"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_crypto_1 = __importDefault(require("node:crypto"));
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const licenseGuard_1 = require("./licenseGuard");
const license_1 = require("../security/license");
function buildLicense(secret, claims) {
    const payload = Buffer.from(JSON.stringify(claims)).toString('base64url');
    const signature = node_crypto_1.default.createHmac('sha256', secret).update(payload).digest('hex');
    return `POSEIDON-LIC.${payload}.${signature}`;
}
function buildApp() {
    const app = (0, express_1.default)();
    app.use(licenseGuard_1.licenseGuard);
    app.get('/protected', (_req, res) => {
        res.status(200).json({ ok: true });
    });
    return app;
}
const originalEnv = { ...process.env };
describe('licenseGuard middleware', () => {
    beforeEach(() => {
        process.env = { ...originalEnv };
        delete process.env.POSEIDON_LICENSE_EXEMPT_PATHS;
        delete process.env.POSEIDON_LICENSE_KEY;
        delete process.env.POSEIDON_LICENSE_REVOKED_HASHES;
    });
    afterAll(() => {
        process.env = originalEnv;
    });
    it('continues in warn mode and emits warning header on invalid license', async () => {
        process.env.POSEIDON_LICENSE_ENFORCEMENT = 'warn';
        process.env.POSEIDON_LICENSE_SECRET = 'test-secret';
        const app = buildApp();
        const response = await (0, supertest_1.default)(app).get('/protected');
        expect(response.status).toBe(200);
        expect(response.headers['x-poseidon-license-warning']).toBe('missing_license_key');
    });
    it('blocks in strict mode on missing license', async () => {
        process.env.POSEIDON_LICENSE_ENFORCEMENT = 'strict';
        process.env.POSEIDON_LICENSE_SECRET = 'test-secret';
        const app = buildApp();
        const response = await (0, supertest_1.default)(app).get('/protected');
        expect(response.status).toBe(503);
        expect(response.body.code).toBe('missing_license_key');
    });
    it('allows valid license in strict mode', async () => {
        process.env.POSEIDON_LICENSE_ENFORCEMENT = 'strict';
        process.env.POSEIDON_LICENSE_SECRET = 'test-secret';
        const nowSec = Math.floor(Date.now() / 1000);
        const key = buildLicense('test-secret', {
            org: 'PoseidonLabs',
            tier: 'enterprise',
            nbf: nowSec - 60,
            exp: nowSec + 600,
        });
        const app = buildApp();
        const response = await (0, supertest_1.default)(app).get('/protected').set('x-poseidon-license', key);
        expect(response.status).toBe(200);
        expect(response.headers['x-poseidon-license-warning']).toBeUndefined();
    });
    it('blocks revoked key in strict mode', async () => {
        process.env.POSEIDON_LICENSE_ENFORCEMENT = 'strict';
        process.env.POSEIDON_LICENSE_SECRET = 'test-secret';
        const nowSec = Math.floor(Date.now() / 1000);
        const key = buildLicense('test-secret', {
            org: 'PoseidonLabs',
            tier: 'enterprise',
            nbf: nowSec - 60,
            exp: nowSec + 600,
        });
        process.env.POSEIDON_LICENSE_REVOKED_HASHES = (0, license_1.hashLicenseKey)((0, license_1.normalizeLicenseKey)(key));
        const app = buildApp();
        const response = await (0, supertest_1.default)(app).get('/protected').set('x-poseidon-license', key);
        expect(response.status).toBe(503);
        expect(response.body.code).toBe('license_revoked');
    });
});

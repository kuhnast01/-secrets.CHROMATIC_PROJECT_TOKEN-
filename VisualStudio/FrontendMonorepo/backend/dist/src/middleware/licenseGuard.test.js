import crypto from 'node:crypto';
import express from 'express';
import request from 'supertest';
import { licenseGuard } from './licenseGuard';
import { hashLicenseKey, normalizeLicenseKey } from '../security/license';
function buildLicense(secret, claims) {
    const payload = Buffer.from(JSON.stringify(claims)).toString('base64url');
    const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    return `POSEIDON-LIC.${payload}.${signature}`;
}
function buildApp() {
    const app = express();
    app.use(licenseGuard);
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
        const response = await request(app).get('/protected');
        expect(response.status).toBe(200);
        expect(response.headers['x-poseidon-license-warning']).toBe('missing_license_key');
    });
    it('blocks in strict mode on missing license', async () => {
        process.env.POSEIDON_LICENSE_ENFORCEMENT = 'strict';
        process.env.POSEIDON_LICENSE_SECRET = 'test-secret';
        const app = buildApp();
        const response = await request(app).get('/protected');
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
        const response = await request(app).get('/protected').set('x-poseidon-license', key);
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
        process.env.POSEIDON_LICENSE_REVOKED_HASHES = hashLicenseKey(normalizeLicenseKey(key));
        const app = buildApp();
        const response = await request(app).get('/protected').set('x-poseidon-license', key);
        expect(response.status).toBe(503);
        expect(response.body.code).toBe('license_revoked');
    });
});

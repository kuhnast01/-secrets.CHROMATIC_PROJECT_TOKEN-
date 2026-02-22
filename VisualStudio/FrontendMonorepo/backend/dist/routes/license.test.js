"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_crypto_1 = __importDefault(require("node:crypto"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_os_1 = __importDefault(require("node:os"));
const node_path_1 = __importDefault(require("node:path"));
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const supertest_1 = __importDefault(require("supertest"));
const license_1 = __importDefault(require("./license"));
const license_2 = require("../security/license");
const licenseRevocations_1 = require("../security/licenseRevocations");
function buildLicense(secret, claims) {
    const payload = Buffer.from(JSON.stringify(claims)).toString('base64url');
    const signature = node_crypto_1.default.createHmac('sha256', secret).update(payload).digest('hex');
    return `POSEIDON-LIC.${payload}.${signature}`;
}
function signToken(role) {
    return jsonwebtoken_1.default.sign({ id: '1', role }, process.env.JWT_SECRET, { expiresIn: '1h' });
}
function buildApp() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use('/license', license_1.default);
    return app;
}
const originalEnv = { ...process.env };
describe('license route tools', () => {
    let revocationStorePath = '';
    beforeEach(() => {
        process.env = { ...originalEnv };
        process.env.JWT_SECRET = 'jwt-test-secret';
        process.env.POSEIDON_LICENSE_SECRET = 'license-test-secret';
        delete process.env.POSEIDON_LICENSE_REVOKED_HASHES;
        revocationStorePath = node_path_1.default.join(node_os_1.default.tmpdir(), `poseidon-license-revocations-${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}.json`);
        process.env.POSEIDON_LICENSE_REVOCATION_STORE_PATH = revocationStorePath;
        for (const entry of (0, licenseRevocations_1.listRuntimeRevocations)()) {
            (0, licenseRevocations_1.removeRuntimeRevocation)(entry.keyHash);
        }
    });
    afterEach(() => {
        if (revocationStorePath && node_fs_1.default.existsSync(revocationStorePath)) {
            node_fs_1.default.unlinkSync(revocationStorePath);
        }
    });
    afterAll(() => {
        process.env = originalEnv;
    });
    it('requires auth for hash tool', async () => {
        const app = buildApp();
        const response = await (0, supertest_1.default)(app).post('/license/tools/hash').send({ licenseKey: 'x' });
        expect(response.status).toBe(401);
    });
    it('allows only admin for hash tool', async () => {
        const app = buildApp();
        const auditorToken = signToken('auditor');
        const response = await (0, supertest_1.default)(app)
            .post('/license/tools/hash')
            .set('Authorization', `Bearer ${auditorToken}`)
            .send({ licenseKey: 'x' });
        expect(response.status).toBe(403);
    });
    it('returns deterministic key hash for admin', async () => {
        const app = buildApp();
        const adminToken = signToken('admin');
        const key = 'POSEIDON-LIC.abc.def';
        const response = await (0, supertest_1.default)(app)
            .post('/license/tools/hash')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ licenseKey: key });
        expect(response.status).toBe(200);
        expect(response.body.keyHash).toBe((0, license_2.hashLicenseKey)((0, license_2.normalizeLicenseKey)(key)));
        expect(response.body.licenseKey).toBeUndefined();
    });
    it('rejects oversized license key payloads', async () => {
        const app = buildApp();
        const adminToken = signToken('admin');
        const oversizedKey = `POSEIDON-LIC.${'a'.repeat(5000)}`;
        const response = await (0, supertest_1.default)(app)
            .post('/license/tools/hash')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ licenseKey: oversizedKey });
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('licenseKey is required');
    });
    it('dry-run validates a good key for admin', async () => {
        const app = buildApp();
        const adminToken = signToken('admin');
        const nowSec = Math.floor(Date.now() / 1000);
        const key = buildLicense('license-test-secret', {
            org: 'PoseidonLabs',
            tier: 'enterprise',
            nbf: nowSec - 60,
            exp: nowSec + 120,
        });
        const response = await (0, supertest_1.default)(app)
            .post('/license/tools/validate')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ licenseKey: key });
        expect(response.status).toBe(200);
        expect(response.body.valid).toBe(true);
        expect(response.body.reason).toBeNull();
        expect(response.body.revoked).toBe(false);
    });
    it('dry-run marks revoked keys', async () => {
        const app = buildApp();
        const adminToken = signToken('admin');
        const nowSec = Math.floor(Date.now() / 1000);
        const key = buildLicense('license-test-secret', {
            org: 'PoseidonLabs',
            tier: 'enterprise',
            nbf: nowSec - 60,
            exp: nowSec + 120,
        });
        process.env.POSEIDON_LICENSE_REVOKED_HASHES = (0, license_2.hashLicenseKey)((0, license_2.normalizeLicenseKey)(key));
        const response = await (0, supertest_1.default)(app)
            .post('/license/tools/validate')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ licenseKey: key });
        expect(response.status).toBe(200);
        expect(response.body.valid).toBe(false);
        expect(response.body.reason).toBe('license_revoked');
        expect(response.body.revoked).toBe(true);
    });
    it('lists, adds, and removes revocations via admin endpoints', async () => {
        const app = buildApp();
        const adminToken = signToken('admin');
        const nowSec = Math.floor(Date.now() / 1000);
        const key = buildLicense('license-test-secret', {
            org: 'PoseidonLabs',
            tier: 'enterprise',
            nbf: nowSec - 60,
            exp: nowSec + 120,
        });
        const keyHash = (0, license_2.hashLicenseKey)((0, license_2.normalizeLicenseKey)(key));
        const addResponse = await (0, supertest_1.default)(app)
            .post('/license/revocations')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ licenseKey: key, reason: 'chargeback' });
        expect(addResponse.status).toBe(201);
        expect(addResponse.body.keyHash).toBe(keyHash);
        expect(addResponse.body.reason).toBe('chargeback');
        const listResponse = await (0, supertest_1.default)(app)
            .get('/license/revocations')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(listResponse.status).toBe(200);
        expect(listResponse.body.count).toBe(1);
        expect(listResponse.body.entries[0].keyHash).toBe(keyHash);
        const deleteResponse = await (0, supertest_1.default)(app)
            .delete(`/license/revocations/${keyHash}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body.removed).toBe(true);
        expect(deleteResponse.body.keyHash).toBe(keyHash);
        expect(deleteResponse.body.audit.actorId).toBe('1');
        expect(deleteResponse.body.audit.actorRole).toBe('admin');
        expect(typeof deleteResponse.body.audit.timestamp).toBe('string');
        const listAfterDeleteResponse = await (0, supertest_1.default)(app)
            .get('/license/revocations')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(listAfterDeleteResponse.status).toBe(200);
        expect(listAfterDeleteResponse.body.count).toBe(0);
    });
    it('rotates a valid key and revokes previous by default', async () => {
        const app = buildApp();
        const adminToken = signToken('admin');
        const nowSec = Math.floor(Date.now() / 1000);
        const sourceKey = buildLicense('license-test-secret', {
            org: 'PoseidonLabs',
            tier: 'enterprise',
            features: ['alerts'],
            nbf: nowSec - 60,
            exp: nowSec + 3600,
        });
        const oldKeyHash = (0, license_2.hashLicenseKey)((0, license_2.normalizeLicenseKey)(sourceKey));
        const rotateResponse = await (0, supertest_1.default)(app)
            .post('/license/tools/rotate')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ licenseKey: sourceKey, features: ['alerts', 'analytics'] });
        expect(rotateResponse.status).toBe(200);
        expect(typeof rotateResponse.body.licenseKey).toBe('string');
        expect(rotateResponse.body.oldKeyHash).toBe(oldKeyHash);
        expect(rotateResponse.body.newKeyHash).toBe((0, license_2.hashLicenseKey)((0, license_2.normalizeLicenseKey)(rotateResponse.body.licenseKey)));
        expect(rotateResponse.body.revokePrevious).toBe(true);
        expect(rotateResponse.body.audit.actorId).toBe('1');
        expect(rotateResponse.body.audit.actorRole).toBe('admin');
        expect(typeof rotateResponse.body.audit.timestamp).toBe('string');
        const validateOldResponse = await (0, supertest_1.default)(app)
            .post('/license/tools/validate')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ licenseKey: sourceKey });
        expect(validateOldResponse.status).toBe(200);
        expect(validateOldResponse.body.valid).toBe(false);
        expect(validateOldResponse.body.reason).toBe('license_revoked');
        const validateNewResponse = await (0, supertest_1.default)(app)
            .post('/license/tools/validate')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ licenseKey: rotateResponse.body.licenseKey });
        expect(validateNewResponse.status).toBe(200);
        expect(validateNewResponse.body.valid).toBe(true);
        expect(validateNewResponse.body.reason).toBeNull();
    });
    it('rotates without revoking previous when configured', async () => {
        const app = buildApp();
        const adminToken = signToken('admin');
        const nowSec = Math.floor(Date.now() / 1000);
        const sourceKey = buildLicense('license-test-secret', {
            org: 'PoseidonLabs',
            tier: 'enterprise',
            nbf: nowSec - 60,
            exp: nowSec + 3600,
        });
        const rotateResponse = await (0, supertest_1.default)(app)
            .post('/license/tools/rotate')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ licenseKey: sourceKey, revokePrevious: false });
        expect(rotateResponse.status).toBe(200);
        expect(rotateResponse.body.revokePrevious).toBe(false);
        expect(rotateResponse.body.audit.actorId).toBe('1');
        expect(rotateResponse.body.audit.actorRole).toBe('admin');
        expect(typeof rotateResponse.body.audit.timestamp).toBe('string');
        const validateOldResponse = await (0, supertest_1.default)(app)
            .post('/license/tools/validate')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ licenseKey: sourceKey });
        expect(validateOldResponse.status).toBe(200);
        expect(validateOldResponse.body.valid).toBe(true);
    });
});

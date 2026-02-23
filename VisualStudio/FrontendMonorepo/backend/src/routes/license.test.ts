import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import express from 'express';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import licenseRoutes from './license';
import { hashLicenseKey, normalizeLicenseKey } from '../security/license';
import { listRuntimeRevocations, removeRuntimeRevocation } from '../security/licenseRevocations';

function buildLicense(secret: string, claims: Record<string, unknown>) {
  const payload = Buffer.from(JSON.stringify(claims)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return `POSEIDON-LIC.${payload}.${signature}`;
}

function signToken(role: string) {
  return jwt.sign({ id: '1', role }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
}

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use('/license', licenseRoutes);
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

    revocationStorePath = path.join(
      os.tmpdir(),
      `poseidon-license-revocations-${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}.json`,
    );
    process.env.POSEIDON_LICENSE_REVOCATION_STORE_PATH = revocationStorePath;

    for (const entry of listRuntimeRevocations()) {
      removeRuntimeRevocation(entry.keyHash);
    }
  });

  afterEach(() => {
    if (revocationStorePath && fs.existsSync(revocationStorePath)) {
      fs.unlinkSync(revocationStorePath);
    }
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('requires auth for hash tool', async () => {
    const app = buildApp();
    const response = await request(app).post('/license/tools/hash').send({ licenseKey: 'x' });

    expect(response.status).toBe(401);
  });

  it('allows only admin for hash tool', async () => {
    const app = buildApp();
    const auditorToken = signToken('auditor');

    const response = await request(app)
      .post('/license/tools/hash')
      .set('Authorization', `Bearer ${auditorToken}`)
      .send({ licenseKey: 'x' });

    expect(response.status).toBe(403);
  });

  it('returns deterministic key hash for admin', async () => {
    const app = buildApp();
    const adminToken = signToken('admin');
    const key = 'POSEIDON-LIC.abc.def';

    const response = await request(app)
      .post('/license/tools/hash')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ licenseKey: key });

    expect(response.status).toBe(200);
    expect(response.body.keyHash).toBe(hashLicenseKey(normalizeLicenseKey(key)));
    expect(response.body.licenseKey).toBeUndefined();
  });

  it('rejects oversized license key payloads', async () => {
    const app = buildApp();
    const adminToken = signToken('admin');
    const oversizedKey = `POSEIDON-LIC.${'a'.repeat(5000)}`;

    const response = await request(app)
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

    const response = await request(app)
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

    process.env.POSEIDON_LICENSE_REVOKED_HASHES = hashLicenseKey(normalizeLicenseKey(key));

    const response = await request(app)
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
    const keyHash = hashLicenseKey(normalizeLicenseKey(key));

    const addResponse = await request(app)
      .post('/license/revocations')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ licenseKey: key, reason: 'chargeback' });

    expect(addResponse.status).toBe(201);
    expect(addResponse.body.keyHash).toBe(keyHash);
    expect(addResponse.body.reason).toBe('chargeback');

    const listResponse = await request(app)
      .get('/license/revocations')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.count).toBe(1);
    expect(listResponse.body.entries[0].keyHash).toBe(keyHash);

    const deleteResponse = await request(app)
      .delete(`/license/revocations/${keyHash}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.removed).toBe(true);
    expect(deleteResponse.body.keyHash).toBe(keyHash);
    expect(deleteResponse.body.audit.actorId).toBe('1');
    expect(deleteResponse.body.audit.actorRole).toBe('admin');
    expect(typeof deleteResponse.body.audit.timestamp).toBe('string');

    const listAfterDeleteResponse = await request(app)
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
    const oldKeyHash = hashLicenseKey(normalizeLicenseKey(sourceKey));

    const rotateResponse = await request(app)
      .post('/license/tools/rotate')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ licenseKey: sourceKey, features: ['alerts', 'analytics'] });

    expect(rotateResponse.status).toBe(200);
    expect(typeof rotateResponse.body.licenseKey).toBe('string');
    expect(rotateResponse.body.oldKeyHash).toBe(oldKeyHash);
    expect(rotateResponse.body.newKeyHash).toBe(
      hashLicenseKey(normalizeLicenseKey(rotateResponse.body.licenseKey)),
    );
    expect(rotateResponse.body.revokePrevious).toBe(true);
    expect(rotateResponse.body.audit.actorId).toBe('1');
    expect(rotateResponse.body.audit.actorRole).toBe('admin');
    expect(typeof rotateResponse.body.audit.timestamp).toBe('string');

    const validateOldResponse = await request(app)
      .post('/license/tools/validate')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ licenseKey: sourceKey });

    expect(validateOldResponse.status).toBe(200);
    expect(validateOldResponse.body.valid).toBe(false);
    expect(validateOldResponse.body.reason).toBe('license_revoked');

    const validateNewResponse = await request(app)
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

    const rotateResponse = await request(app)
      .post('/license/tools/rotate')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ licenseKey: sourceKey, revokePrevious: false });

    expect(rotateResponse.status).toBe(200);
    expect(rotateResponse.body.revokePrevious).toBe(false);
    expect(rotateResponse.body.audit.actorId).toBe('1');
    expect(rotateResponse.body.audit.actorRole).toBe('admin');
    expect(typeof rotateResponse.body.audit.timestamp).toBe('string');

    const validateOldResponse = await request(app)
      .post('/license/tools/validate')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ licenseKey: sourceKey });

    expect(validateOldResponse.status).toBe(200);
    expect(validateOldResponse.body.valid).toBe(true);
  });
});

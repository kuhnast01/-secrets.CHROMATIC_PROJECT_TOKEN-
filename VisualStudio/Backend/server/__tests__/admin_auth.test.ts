import request from 'supertest';
import app from '../src/app';
import { savePlayer, getPlayer } from '../src/lib/inMemoryStore';

const ADMIN_TOKEN = 'test-secret';

describe('admin auth middleware', () => {
  beforeEach(async () => {
    process.env.ADMIN_SECRET = ADMIN_TOKEN;
    process.env.NODE_ENV = 'test'; // disable auth
    await savePlayer('player-1', { id: 'player-1', resources: { energy: 0, alloy: 0, credits: 0, data: 0 }, buildings: { 'Energy Reactor': { level: 1 }, 'Credit Vault': { level: 1 } }, lastCollectedAt: Date.now() - 60000 });
  });

  afterEach(() => {
    delete process.env.ADMIN_SECRET;
  });

  test('admin endpoints require valid token when auth is enabled', async () => {
    process.env.NODE_ENV = 'production';
    // without token should fail
    const noToken = await request(app).get('/api/admin/tick/metrics');
    expect(noToken.status).toBe(401);

    // with valid token should succeed
    const withToken = await request(app).get('/api/admin/tick/metrics').set('x-admin-secret', ADMIN_TOKEN);
    expect(withToken.status).toBe(200);
  });

  test('admin tick endpoints work in test mode (auth bypassed)', async () => {
    process.env.NODE_ENV = 'test';
    const res = await request(app).get('/api/admin/tick/metrics');
    expect(res.status).toBe(200);
  });
});

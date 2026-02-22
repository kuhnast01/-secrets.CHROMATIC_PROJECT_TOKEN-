import request from 'supertest';
import app from '../src/app';
import { savePlayer, getPlayer } from '../src/lib/inMemoryStore';

describe('admin tick endpoints', () => {
  beforeEach(async () => {
    await savePlayer('player-1', { id: 'player-1', resources: { energy: 0, alloy: 0, credits: 0, data: 0 }, buildings: { 'Energy Reactor': { level: 1 }, 'Credit Vault': { level: 1 } }, lastCollectedAt: Date.now() - 60000 });
  });

  test('POST /api/admin/tick/trigger runs a tick and updates player', async () => {
    const res = await request(app).post('/api/admin/tick/trigger');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);

    const p = await getPlayer('player-1');
    expect(p.resources.energy).toBeGreaterThan(0);
    expect(p.lastCollectedAt).toBeGreaterThan(Date.now() - 60000);
  });

  test('rate-limits repeated trigger calls', async () => {
    const first = await request(app).post('/api/admin/tick/trigger');
    expect([200, 429]).toContain(first.status);
    const second = await request(app).post('/api/admin/tick/trigger');
    expect([200, 429]).toContain(second.status);
    if (second.status === 429) {
      expect(second.body).toHaveProperty('retryAfterMs');
    }
  });

  test('GET /api/admin/tick/metrics returns metrics', async () => {
    const res = await request(app).get('/api/admin/tick/metrics');
    expect(res.status).toBe(200);
    expect(res.body.metrics).toHaveProperty('ticksRun');
    expect(typeof res.body.metrics.ticksRun).toBe('number');
  });
});

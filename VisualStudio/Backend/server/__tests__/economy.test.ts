import request from 'supertest';
import app from '../src/app';
import { savePlayer, getPlayer } from '../src/lib/inMemoryStore';

describe('economy endpoints', () => {
  beforeEach(async () => {
    // reset player
    await savePlayer('player-1', { id: 'player-1', resources: { energy: 0, alloy: 0, credits: 0, data: 0 }, buildings: {}, lastCollectedAt: Date.now() - 60000 });
  });

  test('GET /api/economy/resources returns produced amounts', async () => {
    const player = { id: 'player-1', resources: { energy: 0, alloy: 0, credits: 0, data: 0 }, buildings: { 'Energy Reactor': { level: 2 }, 'Credit Vault': { level: 1 } }, lastCollectedAt: Date.now() - 60000 };
    await savePlayer('player-1', player);

    const res = await request(app).get('/api/economy/resources');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('produced');
    expect(res.body.produced.energy).toBeGreaterThan(0);
    expect(res.body.resources).toHaveProperty('credits');
  });

  test('POST /api/economy/collect persists resources and updates lastCollectedAt', async () => {
    const nowBefore = Date.now();
    const player = { id: 'player-1', resources: { energy: 0, alloy: 0, credits: 0, data: 0 }, buildings: { 'Energy Reactor': { level: 1 } }, lastCollectedAt: Date.now() - 120000 };
    await savePlayer('player-1', player);

    const res = await request(app).post('/api/economy/collect').send();
    expect(res.status).toBe(200);
    const saved = await getPlayer('player-1');
    expect(saved.lastCollectedAt).toBeGreaterThanOrEqual(nowBefore);
    expect(saved.resources.energy).toBeGreaterThan(0);
  });

  test('POST /api/economy/buildings/upgrade starts upgrade and deducts credits', async () => {
    const player = { id: 'player-1', resources: { credits: 10000 }, buildings: { 'Energy Reactor': { level: 1 } } };
    await savePlayer('player-1', player);

    const res = await request(app).post('/api/economy/buildings/upgrade').send({ building: 'Energy Reactor' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('upgradeCompleteAt');

    const saved = await getPlayer('player-1');
    // cost for level 1 -> (level+1) * 200 = 400
    expect(saved.resources.credits).toBe(9600);
    expect(saved.buildings['Energy Reactor'].upgradeCompleteAt).toBeDefined();
  });

  test('completed building upgrade is applied when reading player profile', async () => {
    const player = { id: 'player-1', resources: { credits: 5000 }, buildings: { 'Energy Reactor': { level: 1, upgradeCompleteAt: Date.now() - 1000 } } };
    await savePlayer('player-1', player);

    const res = await request(app).get('/api/player/profile');
    expect(res.status).toBe(200);
    expect(res.body.buildings['Energy Reactor'].level).toBeGreaterThanOrEqual(2);
    expect(res.body.buildings['Energy Reactor'].upgradeCompleteAt).toBeUndefined();
  });
});

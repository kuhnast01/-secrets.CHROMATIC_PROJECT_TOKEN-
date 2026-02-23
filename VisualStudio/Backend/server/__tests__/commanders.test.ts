import request from 'supertest';
import app from '../src/app';

describe('commanders & fleet', () => {
  test('GET /api/commanders returns static list', async () => {
    const res = await request(app).get('/api/commanders');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.commanders)).toBe(true);
    expect(res.body.commanders.length).toBeGreaterThan(0);
  });

  test('POST /api/commanders/recruit, grant shards, upgrade and POST /api/fleet/save', async () => {
    const recruit = await request(app).post('/api/commanders/recruit').send({ commanderId: 'cmdr-1' });
    expect(recruit.status).toBe(200);
    expect(recruit.body.commander).toHaveProperty('id', 'cmdr-1');

    // initially no shards -> upgrade should fail
    const badUpgrade = await request(app).post('/api/commanders/upgrade').send({ commanderId: 'cmdr-1' });
    expect(badUpgrade.status).toBe(400);

    // grant shards and then upgrade
    const grant = await request(app).post('/api/commanders/grantShards').send({ commanderId: 'cmdr-1', amount: 20 });
    expect(grant.status).toBe(200);
    expect(grant.body.commander.shards).toBeGreaterThanOrEqual(1);

    const up = await request(app).post('/api/commanders/upgrade').send({ commanderId: 'cmdr-1' });
    expect(up.status).toBe(200);
    expect(up.body.commander.level).toBeGreaterThanOrEqual(2);

    const fleet = { commander: up.body.commander, ships: { Frigate: 3 }, power: 123 };
    const saved = await request(app).post('/api/fleet/save').send({ fleet });
    expect(saved.status).toBe(200);
    expect(saved.body).toHaveProperty('fleetId');
    expect(saved.body.fleet).toBeDefined();
  });
});

import request from 'supertest';
import app from '../src/app';

describe('player profile & persistence', () => {
  test('GET /api/player/profile returns profile with tech', async () => {
    const res = await request(app).get('/api/player/profile');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('tech');
    expect(res.body.tech).toHaveProperty('shipAtkPercent');
  });

  test('Saved fleet is referenced in player record', async () => {
    const fleet = { commander: { id: 'cmdr-1' }, ships: { Frigate: 2 }, power: 200 };
    const saved = await request(app).post('/api/fleet/save').send({ fleet, playerId: 'player-1' });
    expect(saved.status).toBe(200);
    const profile = await request(app).get('/api/player/profile');
    // profile should include fleets array with at least one entry
    expect(Array.isArray(profile.body.fleets)).toBe(true);
    expect(profile.body.fleets.length).toBeGreaterThan(0);
  });
});
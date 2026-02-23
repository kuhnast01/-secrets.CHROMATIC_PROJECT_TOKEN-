import request from 'supertest';
import app from '../src/app';

describe('store / purchase', () => {
  test('buy shards with credits for recruited commander', async () => {
    // seed
    await request(app).post('/api/admin/seed');
    // recruit
    const r = await request(app).post('/api/commanders/recruit').send({ commanderId: 'cmdr-1' });
    expect(r.status).toBe(200);
    // buy shard
    const buy = await request(app).post('/api/store/purchase').send({ type: 'shards', commanderId: 'cmdr-1', amount: 2 });
    expect(buy.status).toBe(200);
    expect(buy.body).toHaveProperty('commander');
    expect(buy.body.commander.shards).toBeGreaterThanOrEqual(2);
  });
});
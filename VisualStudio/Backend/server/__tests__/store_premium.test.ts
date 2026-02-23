import request from 'supertest';
import app from '../src/app';

describe('premium store & receipts', () => {
  test('purchase premium pack with valid receipt and buy shards with gems', async () => {
    await request(app).post('/api/admin/seed');

    // invalid receipt rejected
    const bad = await request(app).post('/api/store/purchase').send({ type: 'premiumPack', amount: 50, receipt: 'bad-123' });
    expect(bad.status).toBe(400);

    // valid receipt accepted
    const ok = await request(app).post('/api/store/purchase').send({ type: 'premiumPack', amount: 50, receipt: 'valid-test-001' });
    expect(ok.status).toBe(200);
    expect(ok.body.player.resources.gems).toBeGreaterThanOrEqual(50);

    // recruit commander and buy shards with gems
    await request(app).post('/api/commanders/recruit').send({ commanderId: 'cmdr-1' });
    const buy = await request(app).post('/api/store/purchase').send({ type: 'shards_premium', commanderId: 'cmdr-1', amount: 5 });
    expect(buy.status).toBe(200);
    expect(buy.body.commander.shards).toBeGreaterThanOrEqual(5);
  });
});
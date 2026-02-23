import request from 'supertest';
import app from '../src/app';
import { logEvent, getEvents, clearEvents } from '../src/lib/analytics';

describe('analytics events & persistence', () => {
  afterEach(async () => {
    await clearEvents();
  });

  test('logEvent stores events and getEvents retrieves them', async () => {
    await logEvent('test_event', { user: 'test' });
    const evs = await getEvents();
    expect(evs.length).toBeGreaterThan(0);
    expect(evs[evs.length - 1].type).toBe('test_event');
  });

  test('purchase and combat should emit analytics events', async () => {
    await request(app).post('/api/admin/seed');
    // make a premium purchase with valid receipt
    await request(app).post('/api/store/purchase').send({ type: 'premiumPack', amount: 10, receipt: 'valid-xyz' });
    // run a combat
    await request(app).post('/api/combat/start').send({ fleet: { power: 1000 }, missionId: 'm1' });

    const events = await request(app).get('/api/admin-analytics');
    expect(events.status).toBe(200);
    const list = events.body.events || [];
    expect(list.find((e:any) => e.type === 'purchase')).toBeTruthy();
    expect(list.find((e:any) => e.type === 'combat')).toBeTruthy();
  });
});
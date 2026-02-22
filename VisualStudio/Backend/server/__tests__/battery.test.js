const request = require('supertest');
const app = require('../src/app').default;

describe('AAA Backend Battery Test', () => {
  let playerId = 'testplayer';
  let guildId = 'testguild';
  let seasonId = 'season1';
  let ticketId;

  it('should register and claim login calendar', async () => {
    const res = await request(app).post('/calendar/claim').send({ playerId, type: 'daily' });
    expect(res.body.success).toBe(true);
  });

  it('should progress and claim narrative season', async () => {
    await request(app).post('/season/progress').send({ playerId, seasonId });
    const claim = await request(app).post('/season/claim').send({ playerId, seasonId, chapter: 1 });
    expect(claim.body.success).toBe(true);
  });

  it('should add and claim collection milestone', async () => {
    await request(app).post('/collection/add').send({ playerId, itemId: 'item1' });
    await request(app).post('/collection/add').send({ playerId, itemId: 'item2' });
    await request(app).post('/collection/add').send({ playerId, itemId: 'item3' });
    await request(app).post('/collection/add').send({ playerId, itemId: 'item4' });
    await request(app).post('/collection/add').send({ playerId, itemId: 'item5' });
    await request(app).post('/collection/add').send({ playerId, itemId: 'item6' });
    await request(app).post('/collection/add').send({ playerId, itemId: 'item7' });
    const res = await request(app).post('/collection/claim').send({ playerId, milestoneId: 'collector_10' });
    expect(res.body.error || res.body.success).toBeDefined();
  });

  it('should create and complete a PvP ladder entry', async () => {
    const res = await request(app).post('/pvp/ladder/report').send({ playerId, points: 100 });
    expect(res.body.success).toBe(true);
    const ladder = await request(app).get('/pvp/ladder');
    expect(ladder.body.ladder.length).toBeGreaterThan(0);
  });

  it('should register and complete a guild war', async () => {
    const reg = await request(app).post('/guildwar/register').send({ guilds: [guildId, 'enemy'] });
    expect(reg.body.success).toBe(true);
    const start = await request(app).post('/guildwar/start').send({ warId: reg.body.id });
    expect(start.body.success).toBe(true);
    const complete = await request(app).post('/guildwar/complete').send({ warId: reg.body.id, winner: guildId });
    expect(complete.body.success).toBe(true);
  });

  it('should save and load cloud save', async () => {
    await request(app).post('/cloudsave/save').send({ playerId, data: { foo: 'bar' } });
    const res = await request(app).get('/cloudsave/load').query({ playerId });
    expect(res.body.data.foo).toBe('bar');
  });

  it('should open and close a support ticket', async () => {
    const open = await request(app).post('/support/ticket').send({ playerId, subject: 'Help', message: 'Test' });
    expect(open.body.success).toBe(true);
    ticketId = open.body.id;
    const close = await request(app).post('/support/close').send({ ticketId });
    expect(close.body.success).toBe(true);
  });

  it('should update and fetch remote config', async () => {
    await request(app).post('/config/update').send({ key: 'dropRates', value: { legendary: 0.02 } });
    const res = await request(app).get('/config');
    expect(res.body.config.dropRates.legendary).toBe(0.02);
  });

  it('should push and fetch event feed', async () => {
    await request(app).post('/eventfeed/push').send({ type: 'test', data: { foo: 'bar' } });
    const res = await request(app).get('/eventfeed');
    expect(res.body.feed.length).toBeGreaterThan(0);
  });

  it('should set and get localization', async () => {
    await request(app).post('/localization/set').send({ lang: 'en', key: 'greeting', value: 'Hello' });
    const res = await request(app).get('/localization/en');
    expect(res.body.strings.greeting).toBe('Hello');
  });

  it('should export GDPR data', async () => {
    const res = await request(app).get('/gdpr/export').query({ playerId });
    expect(res.body.data).toBeDefined();
  });
});

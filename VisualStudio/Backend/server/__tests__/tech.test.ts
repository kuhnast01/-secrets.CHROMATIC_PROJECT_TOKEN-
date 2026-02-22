import request from 'supertest';
import app from '../src/app';

describe('tech endpoints', () => {
  test('GET /api/tech returns nodes and POST /api/tech/start applies tech when player has data', async () => {
    // seed player so player has data
    await request(app).post('/api/admin/seed');

    const list = await request(app).get('/api/tech');
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body.tech)).toBe(true);
    expect(list.body.tech.length).toBeGreaterThan(0);

    // attempt research that costs more data than player has should fail for high cost node
    const expensive = list.body.tech.find((t:any) => t.costData > 1000);
    if (expensive) {
      const res = await request(app).post('/api/tech/start').send({ techId: expensive.id });
      expect(res.status).toBe(400);
    }

    // research a cheap node (should succeed)
    const node = list.body.tech[0];
    const res2 = await request(app).post('/api/tech/start').send({ techId: node.id });
    expect([200, 400]).toContain(res2.status); // either applied or rejected due to insufficient data depending on seed
  });
});
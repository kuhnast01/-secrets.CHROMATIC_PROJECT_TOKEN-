import request from 'supertest';
import app from '../src/app';

describe('admin migrate', () => {
  test('migrate in-memory records to persistent store (no-op if no Mongo)', async () => {
    // seed in-memory via admin/seed then migrate
    await request(app).post('/api/admin/seed');
    const res = await request(app).post('/api/admin-migrate/migrate');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('migrated');
  });
});
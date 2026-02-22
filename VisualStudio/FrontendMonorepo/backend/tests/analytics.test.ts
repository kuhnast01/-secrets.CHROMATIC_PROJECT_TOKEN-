/* eslint-env jest */

import request from 'supertest';
import app from '../src/index';
import { Server } from 'http';

let server: Server;

beforeAll((done) => {
  server = app.listen(0, done); // Listen on ephemeral port
});

afterAll((done) => {
  server.close(done);
});

describe('Analytics API', () => {
  it('should get analytics', async () => {
    const login = await request(server).post('/auth/login').send({
      username: 'admin',
      password: 'admin123',
    });
    const token = login.body.token;

    const res = await request(server).get('/analytics').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

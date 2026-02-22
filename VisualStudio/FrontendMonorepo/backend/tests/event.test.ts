/* eslint-env jest */

import request from 'supertest';
import app from '../src/index';
import { Server } from 'http';

let server: Server;

beforeAll((done) => {
  server = app.listen(0, done);
});

afterAll((done) => {
  server.close(done);
});

describe('Event API', () => {
  it('should get events', async () => {
    const login = await request(server).post('/auth/login').send({
      username: 'admin',
      password: 'admin123',
    });
    const token = login.body.token;

    const res = await request(server).get('/events').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

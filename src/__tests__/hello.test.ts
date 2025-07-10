import request from 'supertest';
import { createApp } from '../app';

test('GET /department', async () => {
  const app = await createApp();
  const res = await request(app).get('/department');
  expect(res.statusCode).toBe(200);
});

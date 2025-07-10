import express from 'express';
import { createDb } from './database/db';
import { createDepartmentRouter } from './routes/department';

export async function createApp() {
  const app = express();
  app.use(express.json());

  const db = await createDb();
  app.use('/departments', createDepartmentRouter(db));

  return app;
}
import express from 'express';
import { createDb } from './database/db';
import { createDepartmentRouter } from './routes/department';
import { RxDatabase } from 'rxdb';
import { WoldsHrDatabaseCollections } from './database/collection/databaseCollection';
import { createEmployeeRouter } from './routes/employee';

export async function createApp() {
  const app = express();
  app.use(express.json());

  const db = await createDb();
  app.use('/departments', createDepartmentRouter(db));
  app.use('/employees', createEmployeeRouter(db));

  return app;
}
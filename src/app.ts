import express from 'express';
import { createDb } from './database/db';
import { createDepartmentRouter } from './routes/department'; 
import { createEmployeeRouter } from './routes/employee'; 
import { createAuthenticationRouter } from './routes/authentication';
import { createAccountsRouter } from './routes/account'; 
import cors from 'cors';
import { authenticateToken } from './middleware/authenticateToken';
import cookieParser from 'cookie-parser';

export async function createApp() {
  const app = express();
  app.use(cors()); 
  app.use(cookieParser());  
  app.use(express.json()); 

  const db = await createDb();

  app.use('', createAuthenticationRouter(db));
  app.use(authenticateToken);
  app.use('/departments', createDepartmentRouter(db));
  app.use('/employees', createEmployeeRouter(db));  
  app.use('/accounts', createAccountsRouter(db));

  return app;
} 
import express from 'express';
import { createDb } from './database/db';
import { createDepartmentRouter } from './routes/department'; 
import { createEmployeeRouter } from './routes/employee'; 
import { createAuthenticationRouter } from './routes/authentication';
import { createAccountsRouter } from './routes/account'; 
import cors from 'cors';
import { authenticateToken } from './middleware/authenticateToken';
import cookieParser from 'cookie-parser';
import listEndpoints from 'express-list-endpoints';

export async function createApp() {
  const app = express();
  app.use(cors()); 
  app.use(cookieParser());  
  app.use(express.json()); 

   app.get('/health', (req, res) => {
    console.log('Health check endpoint called');
    res.send('OK');
  });

  const db = await createDb();

  const v1Router = express.Router();

  v1Router.use('', createAuthenticationRouter(db));
  v1Router.use((req, res, next) => {
  console.log(`[v1Router] ${req.method} ${req.path}`);
  next();
});
  v1Router.use(authenticateToken);
  v1Router.use((req, res, next) => {
  console.log(`[v1Router] ${req.method} ${req.path}`);
  next();
});
  v1Router.use('/departments', createDepartmentRouter(db));
  v1Router.use((req, res, next) => {
  console.log(`[v1Router] ${req.method} ${req.path}`);
  next();
});
  v1Router.use('/employees', createEmployeeRouter(db));  
  v1Router.use((req, res, next) => {
  console.log(`[v1Router] ${req.method} ${req.path}`);
  next();
});
  v1Router.use('/accounts', createAccountsRouter(db));

  app.use('/v1', v1Router);

  
console.log(listEndpoints(app));

  return app;
} 
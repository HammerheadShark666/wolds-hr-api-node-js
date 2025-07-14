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

  try 
  {
 
  app.use(cors()); 
  app.use(cookieParser());  
  app.use(express.json()); 
 
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

app.use('/v1', (req, res, next) => {
  console.log(`[app] Incoming request ${req.method} ${req.originalUrl}`);
  next();
});

  app.use('/v1', v1Router);

  // app.use('', v1Router);

  
console.log('--- Listing all endpoints: ---');
console.log(listEndpoints(app));
console.log('--- End of endpoint list ---');

  return app;

    } catch (err) {
      console.error('❌ CreateApp error:', err); 
    }

    return app;
} 
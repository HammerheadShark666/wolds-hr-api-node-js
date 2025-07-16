import express from 'express';
import cors from 'cors';
import { authenticateToken } from './middleware/authenticateToken';
import cookieParser from 'cookie-parser';
import listEndpoints from 'express-list-endpoints'; 
import { createAuthenticationRouter } from './routes/authentication.routes';
import { createRefreshTokenRouter } from './routes/refreshToken.routes';
import { createRegisterRouter } from './routes/register.routes';
import { createDepartmentRouter } from './routes/department.routes';
import { createUsersRouter } from './routes/user.routes';

export async function createApp() {

  const app = express();

  try 
  { 
    app.use(cors()); 
    app.use(cookieParser());  
    app.use(express.json()); 
   
    const v1Router = express.Router();

    v1Router.use('', createAuthenticationRouter());
    v1Router.use('', createRefreshTokenRouter());  
    v1Router.use('', createRegisterRouter());
    v1Router.use(authenticateToken);  
    v1Router.use('/departments', createDepartmentRouter());  
    v1Router.use('/users', createUsersRouter());
  
    app.use('/v1', v1Router);  

    console.log('--- Listing all endpoints: ---');
    console.log(listEndpoints(app));
    console.log('--- End of endpoint list ---'); 

  } catch (err) {
    console.error('CreateApp error:', err); 
  }

  return app;
} 
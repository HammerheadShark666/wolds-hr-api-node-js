import express from 'express'; 
import cookieParser from 'cookie-parser';
import listEndpoints from 'express-list-endpoints'; 
import { createLoginRouter } from './routes/login.routes';
import { createRefreshTokenRouter } from './routes/refreshToken.routes'; 
import { createDepartmentRouter } from './routes/department.routes';
import { createUsersRouter } from './routes/user.routes';
import { errorHandler } from './middleware/errorHandler';
import { validateAccessToken } from './middleware/accessToken';
import {configureCors} from './utils/configureCors';
import { createAuthenticateRouter } from './routes/authenticate.routes';
import { createEmployeesRouter } from './routes/employee.routes';

export async function createApp() {

  const app = express();

  try 
  { 
    app.use(configureCors());
    app.use(cookieParser());
    app.use(express.json());   

    const v1Router = express.Router();

    v1Router.use('', createLoginRouter());
    v1Router.use('', createRefreshTokenRouter());
    v1Router.use('', createAuthenticateRouter());
    v1Router.use(validateAccessToken);
    v1Router.use('/departments', createDepartmentRouter());
    v1Router.use('/employees', createEmployeesRouter());
    v1Router.use('/users', createUsersRouter());
  
    app.use('/v1', v1Router);
    app.use(errorHandler);
 
    // console.log('--- Listing all endpoints: ---');
    // console.dir(listEndpoints(app), { depth: null });
    // console.log('--- End of endpoint list ---'); 

  } catch (err) {
    console.error('CreateApp error:', err);
  }

  return app;
} 

const allowedOrigins = [
  process.env.HOSTED_FRONT_APP_END_URL,
  process.env.LOCAL_FRONT_APP_END_URL,
];
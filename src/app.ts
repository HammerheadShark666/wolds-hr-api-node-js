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
import { createEmployeePhotoRouter } from './routes/employeePhoto.routes'; 
import { SERVER } from './utils/constants';
import cors from 'cors';

export async function createApp() {

  const app = express();

  try 
  {  
    const v1Router = express.Router();  

    app.use(configureCors());

    // --- OPTIONS / Preflight handler for all /api/* ---
    app.options("/api/*", (req, res) => {
      res.setHeader(
        "Access-Control-Allow-Origin",
        req.headers.origin || "*" // must match frontend if credentials=true
      );
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,POST,PUT,DELETE,OPTIONS"
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type,Authorization"
      );
      res.setHeader("Access-Control-Allow-Credentials", "true");
      return res.sendStatus(200);
    });

    // app.use(configureCors());
    // app.options('/api/*', configureCors());

    // app.use(cors({
    //   origin: "https://calm-wave-04d3d5f03.1.azurestaticapps.net",
    //   credentials: true,
    // }));

    // // Preflight handler for all API routesfore
    // app.options("/api/*", (req, res) => {
    //   res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
    //   res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    //   res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    //   res.setHeader("Access-Control-Allow-Credentials", "true");
    //   return res.sendStatus(200);
    // });

    app.use(cookieParser()); 
    app.use(express.json());    

    app.use((req, res, next) => {
      console.log(`[${req.method}] ${req.originalUrl}`);
      next();
    });

    // app.use("/v1", (req, res, next) => {
    //   if (req.method === "OPTIONS") {
    //     // Respond with 200 to allow the browser to proceed
    //     return res.sendStatus(200);
    //   }
    //   next();
    // });

    v1Router.use('', createLoginRouter());
    v1Router.use('', createRefreshTokenRouter());
    v1Router.use('', createAuthenticateRouter());  
    v1Router.use(validateAccessToken);
    v1Router.use('/departments', createDepartmentRouter());
    v1Router.use('/employees', createEmployeesRouter());
    v1Router.use('/employees/photo', createEmployeePhotoRouter());
    v1Router.use('/users', createUsersRouter());
  
    app.use(SERVER.VERSION, v1Router);
    app.use(errorHandler);

    app.use((err: any, req: any, res: any, next: any) => {
      console.error(err);
      res.status(500).json({ error: 'An unexpected error has occurred' });
    });
    
    console.log('--- Listing all endpoints: ---');
    console.dir(listEndpoints(app), { depth: null });
    console.log('--- End of endpoint list ---'); 

  } catch (err) {
    console.error('CreateApp error:', err);
  }

  return app;
} 

const allowedOrigins = [
  process.env.HOSTED_FRONT_APP_END_URL,
  process.env.LOCAL_FRONT_APP_END_URL,
];
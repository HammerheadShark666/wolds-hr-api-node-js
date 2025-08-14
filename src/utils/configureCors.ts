// import dotenv from 'dotenv';
// import cors from 'cors';
// import { CORS } from './constants';

// export function configureCors() {

//   dotenv.config();

//   const allowedOrigins = [
//     "https://calm-wave-04d3d5f03.1.azurestaticapps.net"
//     //process.env.HOSTED_FRONT_APP_END_URL,
//     //process.env.LOCAL_FRONT_APP_END_URL,
//   ];

//   console.log("CORS allowed origins:", allowedOrigins);

//   return cors({
//     origin: function (origin, callback) { 
      
//       if (!origin) return callback(null, true);

//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       } else {
//         return callback(new Error(CORS.NOT_ALLOWED));
//       }
//     },
//     credentials: true,
//   });
// }


import dotenv from "dotenv";
import cors, { CorsOptions } from "cors";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { CORS } from "./constants";

export function configureCors() {
  dotenv.config();

  const allowedOrigins: string[] = [
    "https://calm-wave-04d3d5f03.1.azurestaticapps.net"
  ];

  console.log("CORS allowed origins:", allowedOrigins);

  // Middleware array: first logs headers, then applies CORS
  return [
    // Debug logger
    (req: Request, res: Response, next: NextFunction) => {
      console.log("------ CORS DEBUG ------");
      console.log("Origin header:", req.headers.origin);
      console.log("Referer header:", req.headers.referer);
      console.log("------------------------");
      next();
    },

    // CORS configuration
    cors({
      origin: (origin: string | undefined, callback) => {
        if (!origin) {
          // Allow requests with no origin (like Postman)
          return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        } else {
          console.warn(`CORS blocked: ${origin} not in allowedOrigins`);
          return callback(new Error(CORS.NOT_ALLOWED));
        }
      },
      credentials: true
    }) as unknown as RequestHandler
  ];
}

import cors from 'cors';
import dotenv from 'dotenv';
import { CORS } from './constants';

export function configureCors() {
  dotenv.config();

  const allowedOrigins = [
    process.env.HOSTED_FRONT_APP_END_URL,
    process.env.LOCAL_FRONT_APP_END_URL,
  ];

  const normalizedOrigins = allowedOrigins.map(o =>
    o?.toLowerCase().replace(/\/$/, '')
  );

  console.log('CORS allowed origins:', normalizedOrigins);

  return cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow curl / server-to-server

      const normalizedOrigin = origin.toLowerCase().replace(/\/$/, '');
      if (normalizedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }
      return callback(new Error(CORS.NOT_ALLOWED));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204
  });
}
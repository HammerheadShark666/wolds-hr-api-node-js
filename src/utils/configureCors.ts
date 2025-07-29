import dotenv from 'dotenv';
import cors from 'cors'; 

export function configureCors() {

  dotenv.config();

  const allowedOrigins = [
    process.env.HOSTED_FRONT_APP_END_URL,
    process.env.LOCAL_FRONT_APP_END_URL,
  ];

  console.log("CORS allowed origins:", allowedOrigins);

  return cors({
    origin: function (origin, callback) { 
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  });
}
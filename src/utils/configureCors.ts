import dotenv from 'dotenv';
import cors from 'cors';
import { CORS } from './constants';

// export function configureCors() {

//   dotenv.config();

//   const allowedOrigins = [ 
//     process.env.HOSTED_FRONT_APP_END_URL,
//     process.env.LOCAL_FRONT_APP_END_URL,
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

//export function configureCors() {
  // const allowedOrigins = [
  //   process.env.HOSTED_FRONT_APP_END_URL,
  //   process.env.LOCAL_FRONT_APP_END_URL
  // ];

//   const allowedOrigins = [
//   "https://calm-wave-04d3d5f03.1.azurestaticapps.net", // your hosted frontend
//   "http://localhost:3000"                                 // local development
// ];

//   return cors({
//     origin: (origin, callback) => {
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.includes(origin)) return callback(null, true);
//       return callback(new Error("CORS Not Allowed"));
//     },
//     credentials: true
//   });
// }
 
import request from 'supertest';
import { connectToDatabase } from '../../db/mongoose';
import { createApp } from '../../app';
import dotenv from 'dotenv'; 

export default async function globalSetup() {
 
  dotenv.config();
  global.app = await createApp();
  await connectToDatabase();

  console.log("globalSetup");

  global.username = `john_${Date.now()}@hotmail.com`;
  global.password = "Password#1";

  //Register a user
  const registerResponse = await request(global.app)
    .post("/v1/register")
      .set("Content-Type", "application/json")
      .send({ username: global.username, password: global.password, confirmPassword: global.password }); 
  
  if (!registerResponse.body || !registerResponse.body.userId)
    throw new Error('User registration failed in global setup');

  global.userId = registerResponse.body.userId; 
 
  //Login to register use and use this authenticated tests
  const response = await request(global.app!)
      .post("/v1/login") 
        .set("Content-Type", "application/json")
        .send({ username: global.username, password: global.password });

  if (response.status !== 200)
    throw new Error('Login failed in global setup');
   
  const cookiesHeader = response.headers['set-cookie'];
  const cookiesArray = Array.isArray(cookiesHeader) ? cookiesHeader : [cookiesHeader];
  
  const refreshTokenCookie = cookiesArray.find((cookie: string) =>
    cookie.startsWith('refreshToken='));    
  const token = refreshTokenCookie!.split(';')[0].split('=')[1]; 
    
  global.REFRESH_TOKEN = refreshTokenCookie;
  global.ACCESS_TOKEN = response.body.token; 

  console.log('Global setup completed');
}
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

  console.log("create user: ", global.username, global.password);

  //Register a user
  const registerResponse = await request(global.app)
    .post("/v1/register")
      .set("Content-Type", "application/json")
      .send({ username: global.username, password: global.password, confirmPassword: global.password, surname: 'Doe', firstName: 'John', role: 'clerk' }); 
  
  console.log("created user: ", global.username, global.password);
  console.log("body: ", registerResponse.body); 

  if (!registerResponse.body || !registerResponse.body.userId)
    throw new Error('User registration failed in global setup'); 
  
  global.userId = registerResponse.body.userId; 

   console.log("login user: ", global.username, global.password);
 
  //Login to register use and use this login tests
  const response = await request(global.app!)
      .post("/v1/login") 
        .set("Content-Type", "application/json")
        .send({ username: global.username, password: global.password });

  if (response.status !== 200)
    throw new Error('Login failed in global setup');

   console.log("Login successful, setting global tokens");
   
  const cookiesHeader = response.headers['set-cookie'];
  const cookiesArray = Array.isArray(cookiesHeader) ? cookiesHeader : [cookiesHeader];
  
  const refreshTokenCookie = cookiesArray.find((cookie: string) =>
    cookie.startsWith('refreshToken='));    
  const token = refreshTokenCookie!.split(';')[0].split('=')[1]; 
    
  global.REFRESH_TOKEN = refreshTokenCookie;
  global.ACCESS_TOKEN = response.body.token; 

  console.log('Global setup completed');
}
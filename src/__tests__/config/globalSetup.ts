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

  const response = await request(global.app)
    .post("/v1/register")
    .set("Content-Type", "application/json")
    .send({ username: global.username, password: global.password }); 

  if (!response.body || !response.body.userId)
    throw new Error('User registration failed in global setup');

  global.userId = response.body.userId; 

  const loginResponse = await request(global.app)
    .post("/v1/login")
    .send({ username, password });

  if (loginResponse.status !== 200)
    throw new Error('Login failed in global setup');

  global.ACCESS_TOKEN = loginResponse.body.token;

  console.log('Global setup completed');
}

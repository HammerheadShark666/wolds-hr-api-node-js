import request from 'supertest';
import { connectToDatabase } from '../../db/mongoose';
import { createApp } from '../../app';
import dotenv from 'dotenv'; 
import 'tslib';

export default async function globalSetup() {
 
  dotenv.config();
  
  global.app = await createApp();
  await connectToDatabase();

  console.log("globalSetup"); 

  global.username = `john@hotmail.com`;
  global.password = "Password#1"; 

  await loginToMasterAccount(); 
  await addNewUser(); 
  await logoutOfMasterAccount();
  await loginAsNewUser();  

  console.log('Global setup completed');
}

function getCookie(response: request.Response, cookieName: string): string | null {

  const cookiesHeader = response.headers['set-cookie'];
  const cookiesArray = Array.isArray(cookiesHeader) ? cookiesHeader : [cookiesHeader];
  
  const cookie = cookiesArray.find((cookie: string) =>
    cookie.startsWith(cookieName + '='));  
  
  return cookie;
}

async function loginToMasterAccount() {

  const response = await request(global.app!)
      .post("/v1/login") 
        .set("Content-Type", "application/json")
        .send({ username: global.username, password: global.password });

  if (response.status !== 200)
    throw new Error('Login failed in global setup');  
 
  global.REFRESH_TOKEN = getCookie(response, "refresh_token"); 
  global.ACCESS_TOKEN =  getCookie(response, "access_token");
}

async function addNewUser() {
 
  global.username = `john_${Date.now()}@hotmail.com`;
  global.password = "Password#1";

  if(global.ACCESS_TOKEN == null)
    throw new Error("Access token is missing");
 
  const addedUserResponse = await request(global.app!)
    .post("/v1/users/add")
      .set("Content-Type", "application/json")
      .set("Cookie", [global.ACCESS_TOKEN])
      .send({ username: global.username, password: global.password, confirmPassword: global.password, surname: 'Doe', firstName: 'John', role: 'clerk' }); 
    
  if (!addedUserResponse.body || !addedUserResponse.body.userId)
    throw new Error('User registration failed in global setup'); 
  
  global.userId = addedUserResponse.body.userId;  
}

async function logoutOfMasterAccount() { 

  if(global.ACCESS_TOKEN == null)
    throw new Error("Access token is missing");

  const response = await request(global.app!)
    .post("/v1/logout") 
      .set("Content-Type", "application/json")
      .set("Cookie", [global.ACCESS_TOKEN]) 
      .send(); 
} 

async function loginAsNewUser() {

  const response = await request(global.app!)
  .post("/v1/login") 
    .set("Content-Type", "application/json")
    .send({ username: global.username, password: global.password });

  if (response.status !== 200)
    throw new Error('Login failed in global setup');  

  const refreshTokenCookie = getCookie(response, "refresh_token");
  const accessTokenCookie =  getCookie(response, "access_token");
    
  global.REFRESH_TOKEN = refreshTokenCookie;
  global.ACCESS_TOKEN = accessTokenCookie; 
}
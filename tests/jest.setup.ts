import request from "supertest"; 
import dotenv from "dotenv";
import { createApp } from "../src/app"; 

dotenv.config(); 
  
beforeAll(async () => {
  global.app = await createApp();
 
  const response = await request(app)
    .post("/v1/login1")
    .send({ username: "john@hotmail.com", password: "Password#1" });

  if (response.status !== 200) {
    throw new Error("Failed to login during global setup");
  }

  global.ACCESS_TOKEN = response.body.token;
});

import mongoose from 'mongoose';
import request from 'supertest';

export default async function globalTeardown() {
    
  if (!global.app) {
    throw new Error('global.app is undefined in globalTeardown');
  }

  if (!global.userId) {
    throw new Error('global.userId is undefined in globalTeardown');
  }

  if(global.ACCESS_TOKEN == null)
    throw new Error("Access token is missing");
 
  const response = await request(global.app)
    .delete(`/v1/users/${global.userId}`)
    .set("Cookie", [global.ACCESS_TOKEN])
    .send();

  if (response.status !== 200) {
    throw new Error(`Failed to delete user in globalTeardown: ${response.text}`);
  }

  await mongoose.disconnect(); 

  console.log('Global teardown completed');
}

import mongoose from 'mongoose';
import request from 'supertest';

export default async function globalTeardown() {
    
  if (!global.app) {
    throw new Error('global.app is undefined in globalTeardown');
  }

  if (!global.userId) {
    throw new Error('global.userId is undefined in globalTeardown');
  }
 
  const response = await request(global.app)
    .delete(`/v1/users/${global.userId}`)
    .set('Authorization', `Bearer ${global.ACCESS_TOKEN || ''}`)
    .send();

  if (response.status !== 200) {
    throw new Error('Failed to delete user in globalTeardown: ' + response.text);
  }

  await mongoose.disconnect(); 

  console.log('Global teardown completed');
}

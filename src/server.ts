import express from 'express';  
import dotenv from 'dotenv';
import { createApp } from './app';
import { connectToDatabase } from './db/mongoose';

const wrapperApp = express();  
const PORT = process.env.PORT || 3000;
  
async function startServer() {
  try {

    dotenv.config();
    
    const coreApp = await createApp(); 
    wrapperApp.use('/api', coreApp);    

    await connectToDatabase();
    console.log('Database connected');

    wrapperApp.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}/api`);
    });
  } catch (err) {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  }
}

startServer().catch((err) => {
  console.log("DEPLOYED VERSION - " + new Date().toISOString());
  console.error("Failed to start server:", err);
});

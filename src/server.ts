import { createApp } from './app';
import express from 'express';
import dotenv from 'dotenv';

async function startServer() {
  const coreApp = await createApp();
  const wrapperApp = express(); 
  
  dotenv.config();

  wrapperApp.use('/api', coreApp);

  const PORT = process.env.PORT || 3000;
  wrapperApp.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/api`);
  });
}

startServer().catch((err) => {
  console.log("✅ DEPLOYED VERSION - " + new Date().toISOString());
  console.error("❌ Failed to start server:", err);
});
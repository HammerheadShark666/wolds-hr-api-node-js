import { createApp } from './app';
import express from 'express';

async function startServer() {
  const coreApp = await createApp();
  const wrapperApp = express();

  wrapperApp.use('/api', coreApp);

  const PORT = process.env.PORT || 3000;
  wrapperApp.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/api`);
  });
}

startServer();
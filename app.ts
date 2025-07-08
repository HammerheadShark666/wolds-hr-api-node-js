import express from 'express';
import { createDb } from './database/db.ts';
import { createDepartmentRouter } from './api/api-department.ts';
import { createAuthenticationRouter } from './api/api-authentication.ts';
import { createEmployeeRouter } from './api/api-employee.ts';
import { createEmployeeImportRouter } from './api/api-employee-import.ts';
  
async function startServer() {

  console.log("About to start wolds-hr...");

  const app = express();
  app.use(express.json());

  const db = await createDb();

  app.use('/department', createDepartmentRouter(db));
  app.use('/authentication', createAuthenticationRouter(db));
  app.use('/employee', createEmployeeRouter(db));
  app.use('/employee-import', createEmployeeImportRouter(db));
  
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

await startServer()
  .then(() => console.log("start wolds-hr server finished"))
  .catch(err => {
    console.error("Error in wolds-hr startServer:", err);
  });

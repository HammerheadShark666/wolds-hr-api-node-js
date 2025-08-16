import express from 'express';  
import dotenv from 'dotenv';
import { createApp } from './app';
import { connectToDatabase } from './db/mongoose';
import { insertDefaultEmployees } from './db/defaultData/employeeDefaultData';
import { EmployeeModel } from './models/employee.model';
import { SERVER } from './utils/constants';

const wrapperApp = express();  
  
async function startServer() {
  try {

    dotenv.config();
    
    const PORT = process.env.PORT || SERVER.DEFAULT_PORT;
    const coreApp = await createApp(); 
 
    wrapperApp.use(SERVER.API_PATH, coreApp);    

    await connectToDatabase();
    console.log('Database connected'); 

    await insertDefaultEmployeesIfEmpty();

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

async function insertDefaultEmployeesIfEmpty() {
  const count = await EmployeeModel.countDocuments();
  if (count === 0) {
    await insertDefaultEmployees();
  }
}

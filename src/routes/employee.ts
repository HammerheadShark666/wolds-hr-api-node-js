import { Router } from 'express';
import { RxDatabase } from 'rxdb';
import { v4 as uuidv4 } from 'uuid';
import { mapEmployee } from '../utils/mapper';  
import { WoldsHrDatabaseCollections } from '../database/collection/databaseCollection';
import { BaseEmployee } from '../interface/employee';
 
export function createEmployeeRouter(db: RxDatabase<WoldsHrDatabaseCollections>) {
  
  const router = Router(); 

  router.get('', async (_req, res) => { 
    const employees = await db.employees.find().exec(); 
    const response: BaseEmployee[] = employees.map(emp => {
    return mapEmployee(emp);
    });
    res.json(response);
  });

  return router;
}
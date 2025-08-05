import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { searchEmployeesAsync, searchEmployeesPagedAsync } from '../services/employee.service';
import { EmployeeSearchRequest } from '../interface/employee';

export function createEmployeesRouter() {
  
  const router = Router();  

    router.get(
    '/search', 
    asyncHandler(async (req: Request<{}, {}, {}, EmployeeSearchRequest>, res: Response) => {
   
      const result = await searchEmployeesPagedAsync(req.query);  
      if (!result.success) { 
        res.status(400).json({ error: result.error });
        return;
      } 
      res.status(200).json(result); 
     })
  );
  
  return router;
}
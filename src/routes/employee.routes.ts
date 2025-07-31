import { Router, Request, Response } from 'express';
// import { toEmployeeResponse } from '../utils/mapper';
// import { EmployeeResponse,  } from '../interface/department'; 
import asyncHandler from 'express-async-handler';
import { searchEmployeesAsync, searchEmployeesPagedAsync } from '../services/employee.service';
import { EmployeeSearchRequest } from '../interface/employee';

export function createEmployeesRouter() {
  
  const router = Router();  

    router.get(
    '/search', 
    asyncHandler(async (req: Request<{}, {}, {}, EmployeeSearchRequest>, res: Response) => {
  
      const result = await searchEmployeesPagedAsync(req.query);
     // const result = await searchEmployeesAsync(req.query);
      if (!result.success) { 
        res.status(400).json({ error: result.error });
        return;
      }

     // const response: EmployeeResponse[] = result.data.map(toEmployeeResponse);
      res.status(200).json(result); 
     })
  );
  
  return router;
}
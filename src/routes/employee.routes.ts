import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { addEmployeeAsync, deleteEmployeeAsync, searchEmployeesPagedAsync } from '../services/employee.service';
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
      res.status(200).json(result.data); 
     })
  );

  router.post(
    '/',
    asyncHandler(async (req: Request, res: Response) => {
      const result = await addEmployeeAsync(req.body);
      if (!result.success) {
        res.status(result.code ?? 400).json({ error: result.error });
        return;
      }  
      res.status(201).json(result.data);
    })
  );

  router.delete(
      '/:id',
      asyncHandler(async (req: Request, res: Response) => {
        const result = await deleteEmployeeAsync(req.params.id);
        if (!result.success) {
          res.status(result.code ?? 400).json({ error: result.error });
          return;
        }
        res.status(200).json({ message: 'Employee deleted' });
      })
    ); 
  
  return router;
}
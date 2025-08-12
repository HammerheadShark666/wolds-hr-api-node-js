import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { addEmployeeAsync, deleteEmployeeAsyncAsync, getEmployeeAsync, searchEmployeesPagedAsync, updateEmployeeAsync } from '../services/employee.service';
import { EmployeeSearchRequest } from '../interface/employee';

export function createEmployeesRouter() {
  
  const router = Router();  
 
  router.get(
    '/search', 
    asyncHandler(async (req: Request<{}, {}, {}, EmployeeSearchRequest>, res: Response) => {
   
      const response = await searchEmployeesPagedAsync(req.query);  
      if (!response.success) { 
        res.status(400).json({ error: response.error });
        return;
      } 
      res.status(200).json(response.data); 
     })
  );

  router.get(
    '/:id',
    asyncHandler(async (req: Request, res: Response) => { 
      const response = await getEmployeeAsync(req.params.id);
      if (!response.success) { 
        res.status(response.code ?? 400).json({ error: response.error });
        return;
      }      
      res.status(200).json(response.data);
    })
  );

  router.post(
    '/',
    asyncHandler(async (req: Request, res: Response) => {
      const response = await addEmployeeAsync(req.body);
      if (!response.success) {
        res.status(response.code ?? 400).json({ error: response.error });
        return;
      }  
      res.status(201).json(response.data);
    })
  );

  router.put(
    '/:id',
    asyncHandler(async (req: Request, res: Response) => { 
      const response = await updateEmployeeAsync(req.params.id, req.body);
      if (!response.success) { 
        res.status(response.code ?? 400).json({ error: response.error });
        return;
      }      
      res.status(200).json(response.data);
    })
  );

  router.delete(
    '/:id',
    asyncHandler(async (req: Request, res: Response) => { 
      
      const response = await deleteEmployeeAsyncAsync(req.params.id); 
      if (!response.success) {
        res.status(response.code ?? 400).json({ error: response.error });
        return;
      }
      res.status(200).json({ message: 'Employee deleted' });
    })
  );  
  
  return router;
}
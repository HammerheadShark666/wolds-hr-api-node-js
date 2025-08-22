import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { EmployeeImportHistoryRequest } from '../interface/employee';
import { deleteEmployeeImportedHistoryAsync, employeesImportedErrorPagedAsync, employeesImportedExistingPagedAsync, employeesImportedHistoryAsync, employeesImportedPagedAsync } from '../services/employeeImportHistory.service';

export function createEmployeeImportHistoryRouter() {
  
  const router = Router();   

  router.get(
    '', 
    asyncHandler(async (req: Request, res: Response) => { 
   
      const response = await employeesImportedHistoryAsync();  
      if (!response.success) { 
        res.status(400).json({ error: response.error });
        return;
      } 
      res.status(200).json(response.data); 
     })
  );  

  router.get(
    '/imported', 
    asyncHandler(async (req: Request<{}, {}, {}, EmployeeImportHistoryRequest>, res: Response) => {
   
      const response = await employeesImportedPagedAsync(req.query);  
      if (!response.success) { 
        res.status(400).json({ error: response.error });
        return;
      } 
      res.status(200).json(response.data); 
     })
  );  

  router.get(
    '/existing', 
    asyncHandler(async (req: Request<{}, {}, {}, EmployeeImportHistoryRequest>, res: Response) => {
   
      const response = await employeesImportedExistingPagedAsync(req.query);  
      if (!response.success) { 
        res.status(400).json({ error: response.error });
        return;
      } 
      res.status(200).json(response.data); 
     })
  );   

   router.get(
    '/error', 
    asyncHandler(async (req: Request<{}, {}, {}, EmployeeImportHistoryRequest>, res: Response) => {
   
      const response = await employeesImportedErrorPagedAsync(req.query);  
      if (!response.success) { 
        res.status(400).json({ error: response.error });
        return;
      } 
      res.status(200).json(response.data); 
     })
  );

  router.delete(
    '/:id', 
    asyncHandler(async (req: Request, res: Response) => { 

      const response = await deleteEmployeeImportedHistoryAsync(req.params.id);  
      if (!response.success) { 
        res.status(400).json({ error: response.error });
        return;
      } 
      res.sendStatus(200);
     })
  );  
 
  return router;
}
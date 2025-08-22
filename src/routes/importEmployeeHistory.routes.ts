import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { deleteImportedEmployeeHistoryAsync, importedEmployeesErrorPagedAsync, importedEmployeesExistingPagedAsync, importedEmployeesHistoryAsync, importedEmployeesPagedAsync } from '../services/employeeImportHistory.service';
import { ImportedEmployeesHistoryRequest } from '../interface/employeeImportHistory';

export function createImportEmployeesHistoryRouter() {
  
  const router = Router();   

  router.get(
    '', 
    asyncHandler(async (req: Request, res: Response) => { 
   
      const response = await importedEmployeesHistoryAsync();   
      
      if (!response.success) { 
        res.status(400).json({ error: response.error });
        return;
      } 
      res.status(200).json(response.data); 
     })
  );  

  router.get(
    '/imported', 
    asyncHandler(async (req: Request<{}, {}, {}, ImportedEmployeesHistoryRequest>, res: Response) => {
   
      const response = await importedEmployeesPagedAsync(req.query);   

      if (!response.success) { 
        res.status(400).json({ error: response.error });
        return;
      } 
      res.status(200).json(response.data); 
     })
  );  

  router.get(
    '/existing', 
    asyncHandler(async (req: Request<{}, {}, {}, ImportedEmployeesHistoryRequest>, res: Response) => {
   
      const response = await importedEmployeesExistingPagedAsync(req.query);  
      if (!response.success) { 
        res.status(400).json({ error: response.error });
        return;
      } 
      res.status(200).json(response.data); 
     })
  );   

   router.get(
    '/error', 
    asyncHandler(async (req: Request<{}, {}, {}, ImportedEmployeesHistoryRequest>, res: Response) => {
   
      const response = await importedEmployeesErrorPagedAsync(req.query);  
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

      const response = await deleteImportedEmployeeHistoryAsync(req.params.id);  
      if (!response.success) { 
        res.status(400).json({ error: response.error });
        return;
      } 
      res.sendStatus(200);
     })
  );  
 
  return router;
}
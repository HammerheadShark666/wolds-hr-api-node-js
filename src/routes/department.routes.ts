import { Router, Request, Response } from 'express';
import { toDepartmentResponse } from '../utils/mapper';
import { DepartmentResponse, UpdateDepartmentRequest,  } from '../interface/department'; 
import { addDepartmentAsync, updateDepartmentAsync, getDepartmentByIdAsync, getDepartmentsAsyncAsync, deleteDepartmentAsync, getDepartmentByNameAsync } from '../services/department.service';
import asyncHandler from 'express-async-handler';

export function createDepartmentRouter() {
  
  const router = Router();  
 
  router.get(
    '', 
    asyncHandler(async (req, res) => {    
      const response = await getDepartmentsAsyncAsync();     
      if (!response.success) {
        res.status(response.code ?? 400).json({ error: response.error });
        return;
      }
      const departmentResponse: DepartmentResponse[] = response.data.map(toDepartmentResponse);
      res.status(200).json(departmentResponse); 
  }));

  router.get(
    '/:id',
    asyncHandler(async (req: Request, res: Response) => {
      const response = await getDepartmentByIdAsync(req.params.id);
      if (!response.success) {
        res.status(response.code ?? 400).json({ error: response.error });
        return;
      }
      res.status(200).json(toDepartmentResponse(response.data));
    })
  );

  router.get(
    '/name/:name',
    asyncHandler(async (req: Request, res: Response) => {
      const response = await getDepartmentByNameAsync(req.params.name);
      if (!response.success) {
        res.status(response.code ?? 400).json({ error: response.error });
        return;
      }
      res.status(200).json(toDepartmentResponse(response.data));
    })
  );

  router.post(
    '',
    asyncHandler(async (req: Request, res: Response) => {  
      const response = await addDepartmentAsync(req.body);
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
      const updateDepartmentRequest: UpdateDepartmentRequest = { id: req.params.id, name: req.body.name };
      const response = await updateDepartmentAsync(updateDepartmentRequest);
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
      const response = await deleteDepartmentAsync(req.params.id);
      if (!response.success) {
        res.status(response.code ?? 400).json({ error: response.error });
        return;
      }
      res.status(200).json({ message: 'Department deleted' });
    })
  ); 

  return router;
}
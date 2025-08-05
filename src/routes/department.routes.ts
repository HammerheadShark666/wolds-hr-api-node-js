import { Router, Request, Response } from 'express';
import { toDepartmentResponse } from '../utils/mapper';
import { DepartmentResponse,  } from '../interface/department'; 
import { addDepartmentAsync, updateDepartmentAsync, getDepartmentByIdAsync, getDepartmentsAsync, deleteDepartmentAsync } from '../services/department.service';
import asyncHandler from 'express-async-handler';

export function createDepartmentRouter() {
  
  const router = Router();  
 
  router.get(
    '', 
    asyncHandler(async (req, res) => {    
      const result = await getDepartmentsAsync();     
      if (!result.success) {
        res.status(result.code ?? 400).json({ error: result.error });
        return;
      }
      const response: DepartmentResponse[] = result.data.map(toDepartmentResponse);
      res.status(200).json(response); 
  }));

  router.get(
    '/:id',
    asyncHandler(async (req: Request, res: Response) => {
      const result = await getDepartmentByIdAsync(req.params.id);
      if (!result.success) {
        res.status(result.code ?? 400).json({ error: result.error });
        return;
      }
      res.status(200).json(toDepartmentResponse(result.data));
    })
  );

  router.post(
    '/',
    asyncHandler(async (req: Request, res: Response) => {
      const result = await addDepartmentAsync(req.body);
      if (!result.success) {
        res.status(result.code ?? 400).json({ error: result.error });
        return;
      } 
      res.status(201).json(result.data);
    })
  );

  router.put(
    '/:id',
    asyncHandler(async (req: Request, res: Response) => {
      const result = await updateDepartmentAsync(req.params.id, req.body.name);
      if (!result.success) {
        res.status(result.code ?? 400).json({ error: result.error });
        return;
      }      
      res.status(200).json(result.data);
    })
  );

  router.delete(
    '/:id',
    asyncHandler(async (req: Request, res: Response) => {
      const result = await deleteDepartmentAsync(req.params.id);
      if (!result.success) {
        res.status(result.code ?? 400).json({ error: result.error });
        return;
      }
      res.status(200).json({ message: 'Department deleted' });
    })
  ); 

  return router;
}
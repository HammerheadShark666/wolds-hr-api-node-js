import { Router } from 'express';
import { toDepartmentResponse } from '../utils/mapper';
import { DepartmentResponse,  } from '../interface/department'; 
import { createDepartment, updateDepartment, getDepartmentById, getDepartmentByName, getDepartments, deleteDepartment } from '../services/department.service';
import asyncHandler from 'express-async-handler';

export function createDepartmentRouter() {
  
  const router = Router(); 
 
  router.get('', asyncHandler(async (req, res) => {
    
    const result = await getDepartments();
    if (!result.success) {
      res.status(400).json({ errors: result.error });
      return;
    } 

    const response: DepartmentResponse[] = result.data.map(dept => toDepartmentResponse(dept));
    res.status(200).json(response); 
  }));

  router.get('/:id', asyncHandler(async (req, res) => {  

    const result = await getDepartmentById(req.params.id);
    if (!result.success) {
      res.status(400).json({ errors: result.error });
      return;
    }

    res.status(200).json(toDepartmentResponse(result.data)); 
  }));

  router.post('/', asyncHandler(async (req, res) => { 
  
    const result = await createDepartment(req.body);
    if (!result.success) {
      res.status(400).json({ errors: result.error });
      return;
    } 
    
    res.status(200).json(result.data);     
  }));

  router.put('/:id', asyncHandler(async (req, res) => {

    const { id } = req.params;
    const { name } = req.body; 

    const result = await updateDepartment(id, name);
    if (!result.success) {
      res.status(400).json({ errors: result.error });
      return;
    }

    res.status(200).json(result.data);
  }));

  router.delete('/:id', asyncHandler(async (req, res) => {

    const id = req.params.id.toString(); 

    const result = await deleteDepartment(id);
    if (!result.success) { 
      res.status(400).json({ errors: result.error });
      return;
    }

    res.status(200).json({ message: 'Department deleted' });
  }));

  return router;
}
import { Router } from 'express';
import { mapDepartment } from '../utils/mapper';
import { AppDepartment,  } from '../interface/department'; 
import { createDepartment, updateDepartment, getDepartmentById, getDepartmentByName, getDepartments, deleteDepartment } from '../services/department.service';

export function createDepartmentRouter() {
  
  const router = Router(); 
 
  router.get('', async (_req, res) => { 
    const result = await getDepartments();

    if (result.success) {
      const response: AppDepartment[] = result.data.map(dept => mapDepartment(dept));
      return res.status(200).json(response);
    }

    return res.status(400).json({ errors: result.error });
  });

  router.get('/:id', async (req, res) => {

    const result = await getDepartmentById(req.params.id);

    if (!result.success) {
      return res.status(400).json({ errors: result.error });
    }

    return res.status(200).json(mapDepartment(result.data)); 
  });

  router.post('/', async (req, res) => {
  
    const result = await createDepartment(req.body);
    if (result.success) {
      return res.status(201).json(result.data);
    }

    return res.status(400).json({ errors: result.error }); 
  });

  router.put('/:id', async (req, res) => {

    const { id } = req.params;
    const { name } = req.body;

    const result = await updateDepartment(id, name);

    if (result.success) {
      return res.status(200).json(result.data);
    }

    return res.status(400).json({ errors: result.error }); 
  });

  router.delete('/:id', async (req, res) => {

    try {

      const id = req.params.id.toString();
      const existingDepartment = await getDepartmentById(id);
      if (!existingDepartment)
        return res.status(404).json({ error: 'Department not found' }); 

      const deletedDepartment = await deleteDepartment(id);

      if (!deletedDepartment)
        return res.status(400).json({ error: 'Department not deleted' }); 

      res.status(200).json({ message: 'Department deleted' });
    } catch (error) {
      console.error('Delete department failed:', error);
      res.status(500).json({ error: 'Internal server error' });
    } 
  }); 

  return router;
}
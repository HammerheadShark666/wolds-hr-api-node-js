import { Router } from 'express';
import { mapDepartment } from '../utils/mapper';
import { AppDepartment,  } from '../interface/department'; 
import { createDepartment, updateDepartment, getDepartmentById, getDepartmentByName, getDepartments, deleteDepartment } from '../services/department.service';

export function createDepartmentRouter() {
  
  const router = Router(); 
 
  router.get('', async (_req, res) => { 
    try { 
      const departments = await getDepartments();
      if(departments == null) 
        return res.status(404).json({ error: 'No departments not found' });

      const response: AppDepartment[] = departments.map(dept => {
        return mapDepartment(dept);
      });
  
      res.json(response);   
    } catch (error) {
      console.error('Get departments failed:', error);
      res.status(500).json({ error: 'Internal server error' });
    } 
  });

  router.get('/:id', async (req, res) => {

    try {
      const id = req.params.id.toString();
      const department = await getDepartmentById(id);

      if (department !== null) 
        res.status(200).json(mapDepartment(department));
      else
        res.status(404).json({ error: 'Department not found' });
      
    } catch (error) {
      console.error('Get department failed:', error);
      res.status(500).json({ error: 'Internal server error' });
    } 
  });

  router.post('/', async (req, res) => {
    try {
    
      const name = req.body.name;      
      if(name == '' || name == undefined || name == null ) 
        return res.status(400).json({ error: 'Department name required' });

      const existingDepartment = await getDepartmentByName(name);
      if (existingDepartment)
        return res.status(400).json({ error: 'Department already exists' });
 
      const department = await createDepartment(name);
      if(department == null)
        return res.status(400).json({ error: 'Department not created' });

      res.status(200).json(mapDepartment(department)); 

    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Error message:', err.message);
        res.status(400).json({ error: err.message });
      } else {
        console.error('Unknown error', err);
        res.status(500).json({ error: 'Unknown error' });
      }
    }
  });

  router.put('/', async (req, res) => {
    try {
 
      const id = req.body.id;
      const name = req.body.name;    
      const existingDepartment = await getDepartmentById(id);
      if (!existingDepartment)
        return res.status(404).json({ error: 'Department not found' });
        
      const updatedDepartment = await updateDepartment(id, name);
      if(updatedDepartment == null)
        return res.status(400).json({ error: 'Department not updated' });

      res.status(200).json(mapDepartment(updatedDepartment));  

    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Error message:', err.message);
        res.status(400).json({ error: err.message });
      } else {
        console.error('Unknown error', err);
        res.status(500).json({ error: 'Unknown error' });
      }
    }
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
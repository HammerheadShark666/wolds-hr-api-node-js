import { Router } from 'express';
import { RxDatabase } from 'rxdb';
import { v4 as uuidv4 } from 'uuid';
import { mapDepartment } from '../utils/mapper'; 
import { ApiDepartment, BaseDepartment } from '../interface/department';
import { WoldsHrDatabaseCollections } from '../database/collection/databaseCollection';

export function createDepartmentRouter(db: RxDatabase<WoldsHrDatabaseCollections>) {
  
  const router = Router(); 

  router.post('/', async (req, res) => {
    try {
    
      const name = req.body.name;    
      const doc = await db.departments.findOne({ selector: { name } }).exec();

      if (doc) {
        return res.status(400).json({ error: 'Department already exists' });
      }

      const id = uuidv4();
      const newDepartment: ApiDepartment = { id: id, name: name , _meta: { lwt: Date.now() }, _deleted: false, _attachments: {}, _rev: "test-data" };
      const response = await db.departments.insert(newDepartment);     
      res.status(200).json(response);
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

  router.get('', async (_req, res) => { 
    const departments = await db.departments.find().exec(); 
    const response: BaseDepartment[] = departments.map(dept => {
      return mapDepartment(dept);
    });
    res.json(response);
  });

  router.get('/:id', async (req, res) => {
    const id = req.params.id.toString();
    const queryResult = await db.departments.findOne({ selector: { id } }).exec();

    if (queryResult !== null) {
      res.status(200).json(queryResult);
    } else {
      res.status(404).json({ message: 'Department not found' });
    }
  });

  router.delete('/:id', async (req, res) => {

    try {

      const id = req.params.id.toString();
      const doc = await db.departments.findOne({ selector: { id } }).exec();

      if (!doc) {
        return res.status(404).json({ error: 'Department not found' });
      }

      await doc.remove();

      res.status(200).json({ message: 'Department deleted' });
    } catch (error) {
      console.error('Delete failed:', error);
      res.status(500).json({ error: 'Internal server error' });
    } 
  }); 

  return router;
}
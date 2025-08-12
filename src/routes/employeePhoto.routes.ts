import { Router, Request, Response } from 'express';
import multer from 'multer';
import { uploadEmployeePhoto } from '../services/employeePhoto.service';

export function createEmployeePhotoRouter() {

  const upload = multer({ storage: multer.memoryStorage() });
  const router = Router();

  router.post('/upload/:id', upload.single('photoFile'), async (req: Request, res: Response) => {
        
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
  
      const response = await uploadEmployeePhoto(req.file.buffer, req.file.originalname, req.file.mimetype, req.params.id);
       
      if (!response.success) {
        res.status(response.code ?? 400).json({ error: response.error });
        return;
      }   

      res.status(200).json(response.data);
    }
  );

  return router;
}

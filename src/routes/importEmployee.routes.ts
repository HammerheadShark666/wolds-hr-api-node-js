import { Router, Request, Response } from 'express'; 
import { FILES, GENERAL_ERRORS } from '../utils/constants';
import multer from 'multer';
import { importEmployees } from '../services/importEmployee.service';

export function createImportEmployeesRouter() {
  
  const upload = multer({ storage: multer.memoryStorage() });
  const router = Router();
  
  router.post('', upload.single(FILES.UPLOAD_IMPORT_FILE_NAME), async (req: Request, res: Response) => {
        
    if (!req.file || req.file.size === 0) {
      return res.status(400).json({ error: GENERAL_ERRORS.NO_FILE_TO_UPLOAD });
    }

    if (!req.is("multipart/form-data")) {
      return res.status(400).json({ error: GENERAL_ERRORS.INVALID_CONTENT_TYPE });
    }

    const response = await importEmployees(req.file.buffer, req.file.mimetype);
        
    if (!response.success) {
      res.status(response.code ?? 400).json({ error: response.error });
      return;
    }   

    res.status(200).json(response.data);
  });
  
  return router;
}
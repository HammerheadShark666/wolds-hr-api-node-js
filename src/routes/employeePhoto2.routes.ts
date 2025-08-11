import { Router, Request, Response } from 'express';
import multer from 'multer';
import { uploadEmployeePhoto } from '../services/employeePhoto.service';


export function createEmployeePhoto2Router() {
  const upload = multer({ storage: multer.memoryStorage() });

  const router = Router();

  router.post(
    '/upload/:id',
    upload.single('photoFile'), async (req: Request, res: Response) => {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      console.log("id=", req.params.id)

      // req.file.buffer contains the file data in memory
      console.log('Received file:', req.file.originalname);
      console.log('Buffer size:', req.file.buffer.length);

      console.log("PRE UPLOAD")
        
      const response = await uploadEmployeePhoto(req.file.buffer, req.file.originalname, req.file.mimetype, req.params.id);
      

      if (!response.success) {
        res.status(response.code ?? 400).json({ error: response.error });
        return;
      }  

      console.log("id = ", response.data.id)
      console.log("filename = ", response.data.filename)
 

      res.status(200).json(response.data);

      // console.log("id = ", response.data.id)

      // console.log("POST UPLOAD")

      // //res.status(200).json(response.data);

      // res.status(200).json({
      //   message: 'File uploaded successfully',
      //   filename: req.file.originalname,
      //   size: req.file.size
      // });
    }
  );

  return router;
}

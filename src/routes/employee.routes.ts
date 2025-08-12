import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { addEmployeeAsync, deleteEmployeeAsync, getEmployeeAsync, searchEmployeesPagedAsync, updateEmployeeAsync } from '../services/employee.service';
import { EmployeeSearchRequest } from '../interface/employee';
//import multer from 'multer';
//import { uploadEmployeePhoto } from '../services/employeePhoto.service';

export function createEmployeesRouter() {
  
  const router = Router();  

  // router.use((req, res, next) => {
  //   console.log(`Employees router middleware for ${req.method} ${req.url}`);
  //   next();
  // });

  // router.all('*', (req, res, next) => {
  //   console.log(`Employees router catch-all for ${req.method} ${req.url}`);
  //   next();
  // });

  

    router.get(
    '/search', 
    asyncHandler(async (req: Request<{}, {}, {}, EmployeeSearchRequest>, res: Response) => {
   
      const response = await searchEmployeesPagedAsync(req.query);  
      if (!response.success) { 
        res.status(400).json({ error: response.error });
        return;
      } 
      res.status(200).json(response.data); 
     })
  );

  router.get(
    '/:id',
    asyncHandler(async (req: Request, res: Response) => { 
      const response = await getEmployeeAsync(req.params.id);
      if (!response.success) { 
        res.status(response.code ?? 400).json({ error: response.error });
        return;
      }      
      res.status(200).json(response.data);
    })
  );

  router.post(
    '/',
    asyncHandler(async (req: Request, res: Response) => {
      const response = await addEmployeeAsync(req.body);
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
      const response = await updateEmployeeAsync(req.params.id, req.body);
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
      
      const response = await deleteEmployeeAsync(req.params.id); 
      if (!response.success) {
        res.status(response.code ?? 400).json({ error: response.error });
        return;
      }
      res.status(200).json({ message: 'Employee deleted' });
    })
  ); 

//   const upload = multer({ storage: multer.memoryStorage() });

//   // router.post('/upload-photo/:id', upload.single('photoFile'), async (req: Request, res: Response) => {
//   //   try {

//   //     console.log('Upload route hit for ID:', req.params.id);

//   //     if (!req.file) {
//   //       return res.status(400).send('No file uploaded');
//   //     }
  
//   //     const response = await uploadEmployeePhoto(req.file.buffer, req.file.originalname, req.file.mimetype, req.params.id);

//   //    // res.status(200); //.json({ data: { "", ""});
//   //     res.status(200).end();
//   //   } catch (error) {
//   //     console.error(error);
//   //     res.status(500).send('Error uploading file');
//   //   }
//   // });

//   // router.post('/upload-photo/:id', (req, res, next) => {  //, upload.single('photoFile')
//   //   console.log('Upload route hit');
//   //   next();
//   // });

//   // router.post('/upload-photo/:id', (req, res, next) => {
//   //   console.log('Content-Type:', req.headers['content-type']);
//   //   next();
//   // }, upload.single('photoFile'), (req, res) => {
//   //   console.log('Upload route hit');
//   //   console.log('File:', req.file);
//   //   res.send('Upload route reached');
//   // });
  
//   // router.post('/upload-photo/:id', (req, res) => {
//   //   try {
//   //      console.log('Upload route hit');
//   //     upload.single('photoFile')(req, res, (err) => {
//   //       if (err) {
//   //         console.error('Multer error:', err);
//   //         return res.status(400).send('Error uploading file');
//   //       }
//   //       if (!req.file) {
//   //         console.error('No file received');
//   //         return res.status(400).send('No file uploaded');
//   //       }
//   //       console.log('Upload route hit');
//   //       console.log('Received file:', req.file.originalname, req.file.size);
//   //       res.send('Upload route reached');
//   //     });
//   //   } catch(err: unknown)
//   //   {
//   //     console.log(err)
//   //   }
//   // });
 
//   router.post('/upload-photo/:id', (req, res, next) => {

//     console.log('Upload route hit');

//     console.log('File object:', req.file);
// console.log('File buffer length:', req.file?.buffer?.length);
// console.log('File mimetype:', req.file?.mimetype);
// console.log('Employee ID param:', req.params.id);

//   upload.single('photoFile')(req, res, function (err) {
//     if (err) {
//       console.error('Multer error:', err);
//       return res.status(400).send('Multer error');
//     }
//     next();
//   });
// }, async (req, res) => {
//   console.log('Upload route hit');
//   console.log('File:', req.file);
//   console.log('Params:', req.params);

//   if (!req.file) {
//     return res.status(400).send('No file uploaded');
//   }

//   try {
//     const response = await uploadEmployeePhoto(
//       req.file.buffer,
//       req.file.originalname,
//       req.file.mimetype,
//       req.params.id
//     );
    
//     if (!response.success) {
//       return res.status(response.code || 500).json({ error: response.error });
//     }
    
//     res.status(200).json({ data: response.data });
//   } catch (error) {
//     console.error('Upload handler error:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

  
  return router;
}
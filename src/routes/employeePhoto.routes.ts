import { Router  } from 'express'; 
import multer from 'multer';
import { uploadEmployeePhoto } from '../services/employeePhoto.service';

// interface MulterRequest extends Request {
//   file?: Express.Multer.File;
//   files?: Express.Multer.File[];
// }


export function createEmployeePhotoRouter() {
  
  const router = Router();  
  const upload = multer({ storage: multer.memoryStorage() });
  

  router.post('/upload', upload.single('photoFile'), async (req, res) => {

 
     

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    console.log("PRE UPLOAD")
  
    const response = await uploadEmployeePhoto(req.file.buffer, req.file.originalname, req.file.mimetype, req.params.id);

    console.log("POST UPLOAD")
     // res.status(200).json({ data: { "", ""});
     // res.status(200).end();


    res.json({ message: 'File uploaded successfully', filename: response });
  });

//   router.post('/upload', upload.single('myFile'), (req: MulterRequest, res: Response) => {
//   if (!req.file) {
//     return res.status(400).json({ error: 'No file uploaded' });
//   }
//   console.log('Uploaded file:', req.file);
//   res.json({ message: 'File uploaded successfully', file: req.file });
// });



  router.use((req, res, next) => {
    console.log(`Employees router middleware for ${req.method} ${req.url}`);
    next();
  });

  router.all('*', (req, res, next) => {
    console.log(`Employees router catch-all for ${req.method} ${req.url}`);
    next();
  });
 
 

  // router.post('/upload/:id', (req, res, next) => {

  //   console.log('Upload route hit');

  //   console.log('File object:', req.file);
  //   console.log('File buffer length:', req.file?.buffer?.length);
  //   console.log('File mimetype:', req.file?.mimetype);
  //   console.log('Employee ID param:', req.params.id);

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
  //     const result = await uploadEmployeePhoto(
  //       req.file.buffer,
  //       req.file.originalname,
  //       req.file.mimetype,
  //       req.params.id
  //     );
      
  //     if (!result.success) {
  //       return res.status(result.code || 500).json({ error: result.error });
  //     }
      
  //     res.status(200).json({ data: result.data });
  //   } catch (error) {
  //     console.error('Upload handler error:', error);
  //     res.status(500).send('Internal Server Error');
  //   }
  // });

//   router.post('/upload/:id', 
//   upload.single('photoFile'),   // <== multer middleware here
//   (req, res, next) => {
//     console.log('Upload route hit');
//     console.log('File object:', req.file);
//     console.log('File buffer length:', req.file?.buffer?.length);
//     console.log('File mimetype:', req.file?.mimetype);
//     console.log('Employee ID param:', req.params.id);
//     next();
//   },
//   async (req, res) => {


//     console.log("req.file")
 

//     if (!req.file) {
//       return res.status(400).send('No file uploaded');
//     }

//     try {
//       const result = await uploadEmployeePhoto(
//         req.file.buffer,
//         req.file.originalname,
//         req.file.mimetype,
//         req.params.id
//       );

//       if (!result.success) {
//         return res.status(result.code || 500).json({ error: result.error });
//       }

//       res.status(200).json({ data: result.data });
//     } catch (error) {
//       console.error('Upload handler error:', error);
//       res.status(500).send('Internal Server Error');
//     }
//   }
// );

  
  return router;
}
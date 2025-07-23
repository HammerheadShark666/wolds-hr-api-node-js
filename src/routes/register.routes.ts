import { Router } from 'express'; 
import asyncHandler from 'express-async-handler';
import { registerUser } from '../services/register.service';
import { RegisterRequest } from '../interface/register';

export function createRegisterRouter() {

  const router = Router();   

  router.post("/register", asyncHandler(async (req, res): Promise<void> => {
    
    try {
 
      const registeredRequest: RegisterRequest = {username: req.body.username, password: req.body.password, confirmPassword: req.body.confirmPassword};
      const result = await registerUser(registeredRequest);
      if (!result.success) {  
        res.status(400).json({ errors: result.error });
        return;
      }  
       
      res.status(200).json(result.data );   
    } catch (err) {
      console.error('Register error:', err);
      res.status(500).send('Internal server error');
    }
  })); 

  return router;
}
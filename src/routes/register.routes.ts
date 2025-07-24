import { Router } from 'express'; 
import asyncHandler from 'express-async-handler';
import { registerUser } from '../services/register.service';
import { RegisterRequest } from '../interface/register';

export function createRegisterRouter() {

  const router = Router();   

  router.post("/register", asyncHandler(async (req, res): Promise<void> => {
     
    const registeredRequest: RegisterRequest = {username: req.body.username, 
                                                password: req.body.password, 
                                                confirmPassword: req.body.confirmPassword, 
                                                surname: req.body.surname, 
                                                firstName: req.body.firstName, 
                                                role: req.body.role};
                                                
    const result = await registerUser(registeredRequest); 

    if (!result.success) {  
      res.status(400).json({ errors: result.error });
      return;
    }  
      
    res.status(200).json(result.data );    
  })); 

  return router;
}
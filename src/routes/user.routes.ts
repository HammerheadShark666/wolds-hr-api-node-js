import { Router, Request, Response } from 'express';
import { addUser, deleteUser, usernameExists, getUserByEmail, getUserById, updateUser } from '../services/user.service';
import { toUserResponse } from '../utils/mapper';
import asyncHandler from 'express-async-handler';
import { AddUserRequest, UpdateUserRequest } from '../interface/user';
import { handleError } from '../utils/error.helper';
import { sendServiceError } from '../utils/sendServiceError.helper';

export function createUsersRouter() {
  
  const router = Router();

  router.post(
    '/add',
    asyncHandler(async (req: Request, res: Response) => {
      const addUserRequest: AddUserRequest = {username: req.body.username, 
                                              password: req.body.password, 
                                              confirmPassword: req.body.confirmPassword, 
                                              surname: req.body.surname, 
                                              firstName: req.body.firstName, 
                                              role: req.body.role};  
                                       
      const result = await addUser(addUserRequest);
      if (!result.success) {
        res.status(result.code ?? 400).json({ error: result.error });
        return;
      }
        
        //return handleError(res, result.error);
 
      res.status(201).json(result.data);
    })
  );
 
  router.get(
    '/id/:id',
    asyncHandler(async (req: Request, res: Response) => {

      const result = await getUserById(req.params.id.toString());
      if (!result.success) {
        res.status(result.code ?? 400).json({ error: result.error});
        return;
      }
      //if (!result.success) return handleError(res, result.error);
 
      res.status(200).json(result.data);
    })
  ); 

  router.get(
      '/email/:email',
      asyncHandler(async (req: Request, res: Response) => {

        const result = await getUserByEmail(req.params.email);

       if (!result.success) {
        res.status(result.code ?? 400).json({ error: result.error });
        return;
      }

        //if (!result.success) return handleError(res, result.error);
  
        res.status(200).json(result.data);
      })
    //   asyncHandler(async (req: Request, res: Response) => {
    //     const email = req.params.email.toString();
    //     if (!email) 
    //     {
    //       res.status(404).json({ error: 'User not found' });
    //       return;
    //     }

    //     const existingUser = await getUserByEmail(email);
    //     if(!existingUser)
    //     {
    //        res.status(404).json({ error: 'User not found' });
    //        return; 
    //     }
      
    //     res.status(200).json(toUserResponse(existingUser));
    // })
  ); 
 
  router.put(
    '/',
    asyncHandler(async (req: Request, res: Response) => {
   
      const updateUserRequest: UpdateUserRequest = {
                                            id: req.body.id, 
                                            surname: req.body.surname, 
                                            firstName: req.body.firstName}; 

       
      const result = await updateUser(updateUserRequest);

      if (!result.success) {
        sendServiceError(res, result);
        return;
      }
      //if (!result.success) return handleError(res, result.error);
 
      res.status(200).json(result.data);


  
      // const updatedUser = await updateUser(updateUserRequest);
      // if(updatedUser== null)
      // {
      //   res.status(400).json({ error: 'User not updated' })
      //   return;
      // }        

     // res.status(200).json(toUserResponse(updatedUser));  
    })
  );

  router.delete(
    '/:id',
    asyncHandler(async (req: Request, res: Response) => {
      const id = req.params.id.toString();
    if (!id) 
    {
      res.status(404).json({ error: 'User not found' });
      return; 
    }        

    const existingUser = await getUserById(id);  
    if (!existingUser)
    {
      res.status(404).json({ error: 'User not found' });
      return;   
    }

    const deletedUser = await deleteUser(id);
    res.status(200).json({ message: 'User deleted' });
    })
  ); 
  
  return router;
}
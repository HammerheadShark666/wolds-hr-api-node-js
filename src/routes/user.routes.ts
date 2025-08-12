import { Router, Request, Response } from 'express';
import { addUserAsync, deleteUserAsync, getUserByUsernameAsync, getUserByIdAsync, updateUserAsync } from '../services/user.service';
import asyncHandler from 'express-async-handler';
import { AddUserRequest, UpdateUserRequest } from '../interface/user';

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
                                       
      const response = await addUserAsync(addUserRequest);
      if (!response.success) {
        res.status(response.code ?? 400).json({ error: response.error });
        return;
      } 
 
      res.status(201).json(response.data);
    })
  );
 
  router.get(
    '/id/:id',
    asyncHandler(async (req: Request, res: Response) => {

      const response = await getUserByIdAsync(req.params.id.toString());
      if (!response.success) {
        res.status(response.code ?? 400).json({ error: response.error});
        return;
      } 
 
      res.status(200).json(response.data);
    })
  ); 

  router.get(
      '/username/:username',
      asyncHandler(async (req: Request, res: Response) => {

        const response = await getUserByUsernameAsync(req.params.username);
        if (!response.success) {
          res.status(response.code ?? 400).json({ error: response.error });
          return;
        } 
  
        res.status(200).json(response.data);
      })  
  ); 
 
  router.put(
    '/',
    asyncHandler(async (req: Request, res: Response) => {
     
      const updateUserRequest: UpdateUserRequest = {
                                            id: req.body.id, 
                                            surname: req.body.surname, 
                                            firstName: req.body.firstName}; 
       
      const response = await updateUserAsync(updateUserRequest);
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
      
      const response = await deleteUserAsync(req.params.id);
      if (!response.success) { 
        res.status(response.code ?? 400).json({ error: response.error });
        return;
      }
      res.status(200).json({ message: 'User deleted' });
    })
  ); 
  
  return router;
}
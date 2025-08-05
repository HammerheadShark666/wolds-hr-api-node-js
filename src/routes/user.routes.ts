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
                                       
      const result = await addUserAsync(addUserRequest);
      if (!result.success) {
        res.status(result.code ?? 400).json({ error: result.error });
        return;
      } 
 
      res.status(201).json(result.data);
    })
  );
 
  router.get(
    '/id/:id',
    asyncHandler(async (req: Request, res: Response) => {

      const result = await getUserByIdAsync(req.params.id.toString());
      if (!result.success) {
        res.status(result.code ?? 400).json({ error: result.error});
        return;
      } 
 
      res.status(200).json(result.data);
    })
  ); 

  router.get(
      '/username/:username',
      asyncHandler(async (req: Request, res: Response) => {

        const result = await getUserByUsernameAsync(req.params.username);
        if (!result.success) {
          res.status(result.code ?? 400).json({ error: result.error });
          return;
        } 
  
        res.status(200).json(result.data);
      })  
  ); 
 
  router.put(
    '/',
    asyncHandler(async (req: Request, res: Response) => {
     
      const updateUserRequest: UpdateUserRequest = {
                                            id: req.body.id, 
                                            surname: req.body.surname, 
                                            firstName: req.body.firstName}; 
       
      const result = await updateUserAsync(updateUserRequest);
      if (!result.success) {
        res.status(result.code ?? 400).json({ error: result.error });
        return;
      } 
      res.status(200).json(result.data); 
    })
  );

  router.delete(
    '/:id',
    asyncHandler(async (req: Request, res: Response) => {
      
      const result = await deleteUserAsync(req.params.id);
      if (!result.success) { 
        res.status(result.code ?? 400).json({ error: result.error });
        return;
      }
      res.status(200).json({ message: 'User deleted' });
    })
  ); 
  
  return router;
}
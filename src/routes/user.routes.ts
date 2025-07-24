import { Router } from 'express';
import { deleteUser, getOtherUserHasUsername, getUserByEmail, getUserById, updateUser } from '../services/user.service';
import { toUserResponse } from '../utils/mapper';
import asyncHandler from 'express-async-handler';

export function createUsersRouter() {
  
  const router = Router(); 


  router.post("/", asyncHandler(async (req, res): Promise<void> => {
     
    // const registeredRequest: RegisterRequest = {username: req.body.username, password: req.body.password, confirmPassword: req.body.confirmPassword};
    // const result = await registerUser(registeredRequest); 

    // if (!result.success) {  
    //   res.status(400).json({ errors: result.error });
    //   return;
    // }  
      
    //res.status(200).json(result.data );    
  })); 


 
  router.get('/id/:id', async (req, res) => {

    try {

      const id = req.params.id.toString();  
      if (!id) 
        return res.status(404).json({ error: 'User not found' }); 

      const existingUser = await getUserById(id);
      if(!existingUser)
        return res.status(404).json({ error: 'User not found' }); 
     
      res.status(200).json(toUserResponse(existingUser));
    } catch (error) {
      console.error('Get user by id  failed:', error);
      res.status(500).json({ error: 'Internal server error' });
    } 
  });  

  router.get('/email/:email', async (req, res) => {

    try { 
       
      const email = req.params.email.toString();
      if (!email) 
        return res.status(404).json({ error: 'User not found' });

      const existingUser = await getUserByEmail(email);
      if(!existingUser)
        return res.status(404).json({ error: 'User not found' }); 
     
      res.status(200).json(toUserResponse(existingUser));
    } catch (error) {
      console.error('Get user by email failed:', error);
      res.status(500).json({ error: 'Internal server error' });
    } 
  });    

  router.put('/', async (req, res) => {

    try {

      const id = req.body.id;
      const username = req.body.username;    
      const role = req.body.role;

      const existingUser = await getUserById(id);
      if (!existingUser)
        return res.status(404).json({ error: 'User not found' });  

      const otherUserWithUsername = await getOtherUserHasUsername(id, username); 
      if (otherUserWithUsername != null)
        return res.status(400).json({ error: 'User with the usename already exists' });
  
      const updatedUser= await updateUser(id, username, role);
      if(updatedUser== null)
        return res.status(400).json({ error: 'User not updated' });

      res.status(200).json(toUserResponse(updatedUser));  

    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Error message:', err.message);
        res.status(400).json({ error: err.message });
      } else {
        console.error('Unknown error', err);
        res.status(500).json({ error: 'Unknown error' });
      }
    }
  });   
 
  router.delete('/:id', async (req, res) => {

    try {

      const id = req.params.id.toString();
      if (!id) 
        return res.status(404).json({ error: 'User not found' }); 

      const existingUser = await getUserById(id);  
      if (!existingUser)
        return res.status(404).json({ error: 'User not found' });   

      const deletedUser = await deleteUser(id);
     
      res.status(200).json({ message: 'User deleted' });
    } catch (error) {
      console.error('Delete User failed:', error);
      res.status(500).json({ error: 'Internal server error' });
    } 
  }); 

  return router;
}
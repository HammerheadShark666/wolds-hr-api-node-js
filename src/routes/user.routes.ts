import { Router } from 'express';
import { deleteUser } from '../services/user.service';

export function createUsersRouter() {
  
  const router = Router(); 
 
  router.delete('/:id', async (req, res) => {

    try {

      const id = req.params.id.toString();
      if (!id) 
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
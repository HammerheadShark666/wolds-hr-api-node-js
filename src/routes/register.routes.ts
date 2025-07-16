import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { createUser, getUserByEmail } from '../services/user.service';

export function createRegisterRouter() {

  const router = Router();   

  router.post("/register", async (req, res) => {
    
    try {
      const { username, password } = req.body;
      if (!username || !password) 
        return res.status(400).json({ error: 'Missing fields' });

      const existingUser = await getUserByEmail(username);
      if (existingUser) 
        return res.status(400).json({ error: "Username already exists." });
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt); 
 
      const response = await createUser({ username, password: hashedPassword }) 
  
      res.json({
        message: "Account registered successfully",
        userId: response._id,
      });
    } catch (err) {
      console.error('Register error:', err);
      res.status(500).send('Internal server error');
    }
  }); 

  return router;
}
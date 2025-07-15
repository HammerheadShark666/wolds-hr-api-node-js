import { Router } from 'express';
import { RxDatabase } from 'rxdb';
import { v4 as uuidv4 } from 'uuid';
import { WoldsHrDatabaseCollections } from '../database/collection/databaseCollection';
import bcrypt from 'bcryptjs';
import { ApiAccount } from '../interface/account';

export function createRegisterRouter(db: RxDatabase<WoldsHrDatabaseCollections>) {

  const router = Router();   

  router.post("/register", async (req, res) => {
    
    try {
      const { username, password } = req.body;
      if (!username || !password) return res.status(400).json({ error: 'Missing fields' });

      const existingUser = await db.accounts.findOne({ selector: { username } }).exec();
      if (existingUser) return res.status(400).json({ error: "Username already exists." });
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newAccount: ApiAccount = {
        id: uuidv4(),
        username,
        password: hashedPassword,
        role: 'Admin',
        tokens: [],
        _meta: { lwt: Date.now() }, _deleted: false, _attachments: {}, _rev: "test-data" 
      };

      const response = await db.accounts.insert(newAccount);     
  
      res.json({
        message: "Account registered successfully",
        accountId: response.id,
      });
    } catch (err) {
      console.error('Register error:', err);
      res.status(500).send('Internal server error');
    }
  }); 

  return router;
}
import { Router } from 'express';
import { RxDatabase } from 'rxdb';
import { WoldsHrDatabaseCollections } from '../database/collection/databaseCollection';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export function createAuthenticationRouter(db: RxDatabase<WoldsHrDatabaseCollections>) {

  const router = Router(); 

  router.post("/login", async (req, res) => {
   
    try { 

      const { username, password } = req.body;
      if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
        
      const account = await db.accounts.findOne({ selector: { username } }).exec();
      if (!account) return res.status(400).json({ error: 'Invalid username or password' });;
  
      const validPassword = await bcrypt.compare(password, account.password);
      if (!validPassword) return res.status(400).json({ error: 'Invalid username or password' }); 

      const secret = process.env.ACCESS_TOKEN_SECRET;
      if (!secret) throw new Error('ACCESS_TOKEN_SECRET is missing');  
  
      const token = jwt.sign({ userId: account.id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' });
      const refreshToken = jwt.sign({ userId: account.id }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' });
      
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/'
      });

      res.json({ token }); 

    } catch (err) {
      console.error('Login error:', err);
      res.status(500).send('Internal server error');
    }
  });
 
  router.post('/logout', async (req, res) => {
    try {
      const token = req.cookies.refreshToken;
      if (!token) return res.sendStatus(204);

      const account = await db.accounts
        .findOne({ selector: { tokens: { $elemMatch: token } } })
        .exec();

      if (account) {
        const existingTokens = account.get('tokens') as string[];
        const updatedTokens = existingTokens.filter((t) => t !== token);

        await account.update({
          $set: { tokens: updatedTokens }
        });
      }

      res.clearCookie('refreshToken', { path: '/refresh-token' });
      res.sendStatus(204);
    } catch (err) {
      console.error('Logout error:', err);
      res.status(500).send('Internal server error');
    }
  });

  return router;
}
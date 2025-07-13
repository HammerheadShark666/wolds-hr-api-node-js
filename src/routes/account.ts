import { Router } from 'express';
import { RxDatabase } from 'rxdb'; 
import { mapAccount } from '../utils/mapper';  
import { WoldsHrDatabaseCollections } from '../database/collection/databaseCollection';
import { AppAccount } from '../interface/account'; 

export function createAccountsRouter(db: RxDatabase<WoldsHrDatabaseCollections>) {
  
  const router = Router(); 

  router.get('', async (_req, res) => { 
    try {
      
      const accounts = await db.accounts.find().exec(); 
      const response: AppAccount[] = accounts.map(account => {
        return mapAccount(account);
      });
      res.json(response);
    } catch (error) {
      console.error('Get accounts failed:', error);
      res.status(500).json({ error: 'Internal server error' });
    } 
  }); 

  return router;
}
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

  router.delete('/:id', async (req, res) => {

    try {

      const id = req.params.id.toString();
      const account = await db.accounts.findOne({ selector: { id } }).exec();

      if (!account) {
        return res.status(404).json({ error: 'Account not found' });
      }

      await account.remove();

      res.status(200).json({ message: 'Account deleted' });
    } catch (error) {
      console.error('Delete Account failed:', error);
      res.status(500).json({ error: 'Internal server error' });
    } 
  }); 

  return router;
}
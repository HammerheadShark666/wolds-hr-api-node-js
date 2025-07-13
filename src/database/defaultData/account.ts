import type { RxDatabase } from 'rxdb'; 
import { v4 as uuidv4 } from 'uuid'; 
import { WoldsHrDatabaseCollections } from '../collection/databaseCollection';
import { ApiAccount } from '../../interface/account';

export async function accountDefaultData(db: RxDatabase<WoldsHrDatabaseCollections>) {  

  const newAccounts: ApiAccount[] = [
    { id: uuidv4(), username: 'john@hotmail.com', password: '$2b$10$n52sJaxFahDdcrltoVS.deW.3ubTe8pxAJEVmMToigTe8an8oFZL2', tokens: [], role: 'admin', _meta: { lwt: Date.now() }, _deleted: false, _attachments: {}, _rev: "test-data" } 
  ];

  for (const account of newAccounts) {
      await db.accounts.insert(account);
  } 
} 
import { addRxPlugin, createRxDatabase, RxDocument } from 'rxdb'; 
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv'; 
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode'; 
import { departmentSchema } from './schema/department';
import { departmentDefaultData } from './defaultData/department';
import { WoldsHrDatabaseCollections } from './collection/databaseCollection'; 
  
addRxPlugin(RxDBDevModePlugin); 

export async function createDb() {

  // Add storage plugin
  const storage = wrappedValidateAjvStorage({
    storage: getRxStorageMemory()
  });
  
  // Create the database
  const db = await createRxDatabase<WoldsHrDatabaseCollections>({
    name: 'wolds_hr',
    storage,
    multiInstance: false,
    eventReduce: true
  });

  // Add plugin & collection
  await db.addCollections({
    departments: {
      schema: departmentSchema
    }
  });
 
  // Add default data
  await departmentDefaultData(db);

  return db;
}
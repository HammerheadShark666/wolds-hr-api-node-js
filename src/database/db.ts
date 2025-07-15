import { addRxPlugin, createRxDatabase, RxDocument } from 'rxdb'; 
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv'; 
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode'; 
import { departmentSchema } from './schema/department';
import { departmentDefaultData } from './defaultData/department';
import { WoldsHrDatabaseCollections } from './collection/databaseCollection'; 
import { employeeSchema } from './schema/employee';
import { employeeDefaultData } from './defaultData/employee';
import { accountSchema } from './schema/account';
import bcrypt from 'bcryptjs';
import { accountDefaultData } from './defaultData/account';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
  
addRxPlugin(RxDBDevModePlugin); 
addRxPlugin(RxDBUpdatePlugin);

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
    },
    employees: {
      schema: employeeSchema
    },
    accounts: {
      schema: accountSchema,
      methods: {
        async checkPassword(this: any, plainPassword: string): Promise<boolean> {
          return bcrypt.compare(plainPassword, this.password);
        }
      }
    }
  });
 
  // Add default data
  await departmentDefaultData(db);
  await employeeDefaultData(db);
  await accountDefaultData(db);

  return db;
}
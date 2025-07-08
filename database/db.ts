import { addRxPlugin, createRxDatabase } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';
import { departmentSchema } from './schema/db-schema-department';
import { employeeSchema } from './schema/db-schema-employee';
import { accountSchema } from './schema/db-schema-accounts';
import { refreshTokenSchema } from './schema/db-schema-refresh-token';
import { employeeImportSchema } from './schema/db-schema-employee-import';
import { employeeImportExistingEmployeeSchema } from './schema/db-schema-employee-import-existing-employee';

addRxPlugin(RxDBDevModePlugin); 

export async function createDb() {
  const storage = wrappedValidateAjvStorage({
    storage: getRxStorageMemory()
  });

  const db = await createRxDatabase({
    name: 'wolds-hr-database',
    storage,
    multiInstance: false,
    eventReduce: false,
  });

  await db.addCollections({
    account: {
      schema: accountSchema,
    },
    department: {
      schema: departmentSchema,
    },
    employeee: {
      schema: employeeSchema,
    },
    employeeImportSchema: {
      schema: employeeImportSchema,
    }, 
    employeeImportExistingEmployeeSchema: {
      schema: employeeImportExistingEmployeeSchema,
    },   
    refreshToken: {
      schema: refreshTokenSchema,
    }
  });

  return db;
}

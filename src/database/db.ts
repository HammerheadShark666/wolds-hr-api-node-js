import { addRxPlugin, createRxDatabase } from 'rxdb'; 
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv'; 
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
//import { employeeSchema } from './schema/db-schema-employee.ts'; 
import { departmentSchema } from './schema/department';
import { departmentDefaultData } from './defaultData/department';
//import { accountSchema } from './schema/db-schema-accounts.js';
// import { refreshTokenSchema } from './schema/db-schema-refresh-token.ts';
// import { employeeImportSchema } from './schema/db-schema-employee-import.ts';
// import { employeeImportExistingEmployeeSchema } from './schema/db-schema-employee-import-existing-employee.ts';

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
    // account: {
    //   schema: accountSchema,
    // },
    departments: {
      schema: departmentSchema,
    },
    // employeee: {
    //   schema: employeeSchema,
    // },
    // employeeImportSchema: {
    //   schema: employeeImportSchema,
    // }, 
    // employeeImportExistingEmployeeSchema: {
    //   schema: employeeImportExistingEmployeeSchema,
    // },   
    // refreshToken: {
    //   schema: refreshTokenSchema,
    // }
  });

  await departmentDefaultData(db);

  return db;
}
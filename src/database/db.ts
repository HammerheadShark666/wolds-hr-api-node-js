import { addRxPlugin, createRxDatabase, RxDocument } from 'rxdb'; 
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




import { RxCollection, RxDatabase } from 'rxdb'; 
import { ApiDepartment, NewDepartment } from '../interface/APIDepartment';

// export interface DepartmentDocMethods {}
// export type DepartmentDocument = RxDocument<ApiDepartment, DepartmentDocMethods>;
// export type DepartmentCollection = RxCollection<DepartmentDocument>;

// export interface MyDatabaseCollections {
//   departments: DepartmentCollection;
// }


export interface DepartmentDocMethods {}

export type DepartmentDocument = RxDocument<ApiDepartment, DepartmentDocMethods>;

// ✅ Use NewDepartment as insert type
export type DepartmentCollection = RxCollection<NewDepartment, DepartmentDocMethods, {}>;

export interface WoldsHrDatabaseCollections {
  departments: DepartmentCollection;
  [key: string]: RxCollection<any>;
}





addRxPlugin(RxDBDevModePlugin); 

export async function createDb() {
  const storage = wrappedValidateAjvStorage({
    storage: getRxStorageMemory()
  });

  

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

  // const db = await createRxDatabase<MyDatabaseCollections>({
  //   name: 'wolds-hr-database',
  //   storage,
  //   multiInstance: false,
  //   eventReduce: false,
  // });

  // await db.addCollections({
  //   // account: {
  //   //   schema: accountSchema,
  //   // },
  //   departments: {
  //     schema: departmentSchema,
  //   },
  //   // employeee: {
  //   //   schema: employeeSchema,
  //   // },
  //   // employeeImportSchema: {
  //   //   schema: employeeImportSchema,
  //   // }, 
  //   // employeeImportExistingEmployeeSchema: {
  //   //   schema: employeeImportExistingEmployeeSchema,
  //   // },   
  //   // refreshToken: {
  //   //   schema: refreshTokenSchema,
  //   // }
  // });

  await departmentDefaultData(db);

  return db;
}
import { RxCollection } from 'rxdb';  
import { DepartmentCollection } from './departmentCollection';
import { EmployeeCollection } from './employeeCollection';
import { AccountCollection } from './accountCollection';

export interface WoldsHrDatabaseCollections {
  departments: DepartmentCollection;
  employees: EmployeeCollection;
  accounts: AccountCollection;
  [key: string]: RxCollection<any>;
}
import { RxCollection } from 'rxdb';  
import { DepartmentCollection } from './departmentCollection';
import { EmployeeCollection } from './employeeCollection';

export interface WoldsHrDatabaseCollections {
  departments: DepartmentCollection;
  employees: EmployeeCollection;
  [key: string]: RxCollection<any>;
}
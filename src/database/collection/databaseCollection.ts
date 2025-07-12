import { RxCollection } from 'rxdb';  
import { DepartmentCollection } from './departmentCollection';

export interface WoldsHrDatabaseCollections {
  departments: DepartmentCollection;
  [key: string]: RxCollection<any>;
}
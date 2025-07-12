import { RxCollection, RxDocument } from "rxdb";  
import { ApiEmployee } from "../../interface/employee";

export interface EmployeeDocMethods {}
export type EmployeeDocument = RxDocument<ApiEmployee, EmployeeDocMethods>; 
export type EmployeeCollection = RxCollection<ApiEmployee, EmployeeDocMethods, {}>;

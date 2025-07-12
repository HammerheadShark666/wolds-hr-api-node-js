import { RxCollection, RxDocument } from "rxdb";  
import { ApiDepartment } from "../../interface/department";

export interface DepartmentDocMethods {}
export type DepartmentDocument = RxDocument<ApiDepartment, DepartmentDocMethods>; 
export type DepartmentCollection = RxCollection<ApiDepartment, DepartmentDocMethods, {}>;

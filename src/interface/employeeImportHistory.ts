import { Types } from "mongoose";
import { IEmployee } from "../models/employee.model";
import { EmployeeResponse } from "./employee";

export interface ImportedEmployeeHistory
{
  id: Types.ObjectId | null | undefined;
  date?: Date;
} 

export interface ImportedEmployeesSuccessHistoryResponse {   
  data?: IEmployee[];   
}
 
export interface ImportedEmployeesHistoryRequest {
  id: Types.ObjectId;
  page?: number;
  pageSize?: number;
}

export interface EmployeeImportHistoryPagedResponse {
  page: number;
  pageSize: number;
  totalPages: number;
  totalEmployees: number;
  employees: EmployeeResponse[];
}
 
export interface EmployeeImportErrorHistoryPagedResponse {
  page: number;
  pageSize: number;
  totalPages: number;
  totalEmployees: number;
  employees?: EmployeeImportError[];
} 
export interface EmployeeImportError {
  employee: string;
  error: string;
}

export interface DeleteEmployeeImportHistoryRequest {
  employeeImportId: Types.ObjectId; 
}

export interface DeleteEmployeeImportHistoryResponse {
  success: boolean;
  count?: number;
  error?: string;
}
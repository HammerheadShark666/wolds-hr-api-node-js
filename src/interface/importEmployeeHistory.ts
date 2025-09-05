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

export interface ImportedEmployeesHistoryPagedResponse {
  page: number;
  pageSize: number;
  totalPages: number;
  totalEmployees: number;
  employees: EmployeeResponse[];
}
 
export interface ImportedEmployeesErrorHistoryPagedResponse {
  page: number;
  pageSize: number;
  totalPages: number;
  totalEmployees: number;
  employees?: ImportedEmployeeError[];
} 
export interface ImportedEmployeeError {
  employee: string;
  error: string;
}

export interface DeleteImportedEmployeesHistoryRequest {
  importEmployeesId: Types.ObjectId; 
}

export interface DeleteImportedEmployeesHistoryResponse {
  success: boolean;
  count?: number;
  error?: string;
}

export interface LastEmployeeImportResponse {
  id: Types.ObjectId;
  date: Date;
  importedEmployeesCount: number;
  importedEmployeesExistingCount: number;
  importedEmployeesErrorsCount: number;
}
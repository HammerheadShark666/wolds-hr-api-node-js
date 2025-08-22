import { Types } from "mongoose";
import { IEmployee } from "../models/employee.model";
import { DepartmentResponse } from "./department";
import { IImportedEmployee } from "../models/importedEmployee.model";
 
export interface EmployeeSearchRequest {
  keyword?: string;
  departmentId?: string;
  page?: number;
  pageSize?: number;
}

export interface EmployeeSearchPagedResponse {
  page: number;
  pageSize: number;
  totalPages: number;
  totalEmployees: number;
  employees: EmployeeResponse[];
  error?: string;
  success: boolean;
}

export interface EmployeeSearchResponse {
  success: boolean;
  data?: IEmployee[];
  error?: string;
}

export interface EmployeeDefaultData {
  surname: string;
  firstName: string;
  dateOfBirth: Date;
  hireDate: Date;
  email: string;
  phoneNumber: string;
  photo?: string;
} 

export interface EmployeeRequest {  
  surname: string;
  firstName: string;
  dateOfBirth?: Date;
  hireDate?: Date;
  email?: string;
  phoneNumber?: string; 
  departmentId?: string;
}

export interface EmployeeResponse {
  id: string;
  surname: string;
  firstName: string;
  dateOfBirth?: Date;
  hireDate?: Date;
  email?: string;
  phoneNumber?: string; 
  photo?: string;
  departmentId?: string;
  department: DepartmentResponse;
}

export interface UploadEmployeePhotoResponse {
  id: string;
  filename: string;
}
 
export interface EmployeeImportHistoryResponse
{
  id: Types.ObjectId | null | undefined;
  date?: Date;
}

export interface EmployeeImportHistoryRequest {
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
  error?: string;
  success: boolean;
}

export interface EmployeesImportHistoryResponse {
  success: boolean;
  data?: IEmployee[];
  error?: string;
}

export interface EmployeesImportedHistoryResponse { 
  employeeImportHistory?: EmployeeImportHistoryResponse[]; 
}

export interface EmployeeImportErrorHistoryResponse {
  success: boolean;
  data?: EmployeeImportError[];
  error?: string;
}

export interface EmployeeImportError {
  employee: string;
  error: string;
}

export interface EmployeeImportErrorHistoryPagedResponse {
  page: number;
  pageSize: number;
  totalPages: number;
  totalEmployees: number;
  success: boolean;
  employees?: EmployeeImportError[];
  error?: string;
}

export interface DeleteEmployeeImportHistoryRequest {
  employeeImportId: Types.ObjectId; 
}

export interface DeleteEmployeeImportHistoryResponse {
  success: boolean;
  count?: number;
  error?: string;
}
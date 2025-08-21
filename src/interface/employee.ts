import { Types } from "mongoose";
import { IEmployee } from "../models/employee.model";
import { DepartmentResponse } from "./department";
 
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
 
export interface EmployeeImportResponse
{
  id: Types.ObjectId | null | undefined;
  date?: Date;
}

export interface EmployeeImportHistoryRequest {
  employeeImportId: Types.ObjectId;
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

export interface EmployeeImportHistoryResponse {
  success: boolean;
  data?: IEmployee[];
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
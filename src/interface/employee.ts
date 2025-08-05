import { IEmployee } from "../models/employee.model";
import { DepartmentResponse } from "./department";

export interface AppEmployee {
  id: string;
  surname: string;
  firstName: string;
} 

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

export interface EmployeeResponse {
  id: string;
  surname: string;
  firstName: string;
  email: string;
  phoneNumber: string;
  department: DepartmentResponse;
  photo: string;
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
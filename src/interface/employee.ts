import { IEmployee } from "../models/employee.model";

export interface AppEmployee {
  id: string;
  surname: string;
  firstName: string;
}

// export interface SearchEmployeeRequest {
//   keyword: string | undefined;
//   departmentId: number | undefined;
//   page: number | undefined;
//   pageSize: number | undefined;
// }

// export interface EmployeeSearchResponse {
//   success: boolean;
//   data?: IEmployee[];
//   error?: string;
// }

export interface EmployeeSearchRequest {
  keyword?: string;
  departmentId?: string;
  page?: number;
  pageSize?: number;
}

export interface EmployeeSearchPagedResponse {
  page: number;
  pageSize: number;
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
}


export interface EmployeeSearchResponse {
  success: boolean;
  data?: IEmployee[];
  error?: string;
}
export interface DepartmentResponse {
  id: string;
  name: string;
}

export interface AddDepartmentRequest { 
  name: string;
}

export interface UpdateDepartmentRequest {
  id: string;
  name: string;
}

export interface UpdatedDepartmentResponse {
  message: string;
  departmentId: string;
}

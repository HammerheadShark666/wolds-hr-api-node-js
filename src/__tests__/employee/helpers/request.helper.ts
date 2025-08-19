import request from 'supertest';
import { EmployeeRequest } from '../../../interface/employee';
import { AUTHENTICATION_ERRORS, PAGE_SIZE } from '../../../utils/constants';

export async function postEmployeeAsync(data?: EmployeeRequest) {
 
  if(global.ACCESS_TOKEN == null)
    throw new Error(AUTHENTICATION_ERRORS.ACCESS_TOKEN_MISSING);

  const req = request(global.app!)
    .post("/v1/employees")
      .set("Cookie", [global.ACCESS_TOKEN])
      .set("Content-Type", "application/json");
  
  if (data !== undefined) {
    return req.send(data);
  }
  return req.send();
}

export async function deleteEmployeeAsync(id: string) {

  if(global.ACCESS_TOKEN == null)
    throw new Error(AUTHENTICATION_ERRORS.ACCESS_TOKEN_MISSING);

  const req = request(global.app!)
    .delete("/v1/employees/" + id)
      .set("Cookie", [global.ACCESS_TOKEN])
      .set("Content-Type", "application/json");
   
  return req.send();
}

export async function getEmployeeAsync(id: string) {

  if(global.ACCESS_TOKEN == null)
    throw new Error(AUTHENTICATION_ERRORS.ACCESS_TOKEN_MISSING);

  const req = request(global.app!)
    .get("/v1/employees/" + id)
      .set("Cookie", [global.ACCESS_TOKEN])
      .set("Content-Type", "application/json");
   
  return req.send();
}

export async function postEmployeePhotoAsync(filePath: string, id: string) {
 
  if(global.ACCESS_TOKEN == null)
    throw new Error(AUTHENTICATION_ERRORS.ACCESS_TOKEN_MISSING); 

  return request(global.app!)
        .post(`/v1/employees/photo/upload/${id}`)
          .set("Cookie", [global.ACCESS_TOKEN])
          .attach('photoFile', filePath); 
}

export async function postImportEmployeeAsync(filePath: string) {
 
  if(global.ACCESS_TOKEN == null)
    throw new Error(AUTHENTICATION_ERRORS.ACCESS_TOKEN_MISSING); 

  return request(global.app!)
        .post(`/v1/employees/import`)
          .set("Cookie", [global.ACCESS_TOKEN])
          .attach('importFile', filePath); 
}

export async function getSearchEmployeesAsync(params?: { keyword:string, departmentId: string, page: number, pageSize: number }) {
  
  const keyword = params?.keyword ?? '';
  const departmentId = params?.departmentId ?? '';
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? PAGE_SIZE; 

  if (!global.ACCESS_TOKEN)
    throw new Error(AUTHENTICATION_ERRORS.ACCESS_TOKEN_MISSING);

  return request(global.app!)
    .get(`/v1/employees/search?keyword=${keyword}&departmentId=${departmentId}&page=${page}&pageSize=${pageSize}`)
    .set("Cookie", [global.ACCESS_TOKEN]);
}

export async function putEmployeeAsync(id?: string, data?: EmployeeRequest) {
 
  if(global.ACCESS_TOKEN == null)
    throw new Error(AUTHENTICATION_ERRORS.ACCESS_TOKEN_MISSING);

  const req = request(global.app!)
    .put("/v1/employees/" + id)
      .set("Cookie", [global.ACCESS_TOKEN])
      .set("Content-Type", "application/json");
  
  if (data !== undefined) {
    return req.send(data);
  }
  return req.send();
}

export async function getDepartmentsAsync() {

  if(global.ACCESS_TOKEN == null)
    throw new Error(AUTHENTICATION_ERRORS.ACCESS_TOKEN_MISSING);

  let req = request(global.app!)
    .get("/v1/departments")
      .set("Cookie", [global.ACCESS_TOKEN]);

  return req;
}
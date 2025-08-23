import request from 'supertest';
import { EmployeeRequest } from '../../../interface/employee';
import { AUTHENTICATION_ERRORS, PAGE_SIZE } from '../../../utils/constants'; 

const baseUrl = '/v1/employees';

export async function postEmployeeAsync(data?: EmployeeRequest) {
 
  if(global.ACCESS_TOKEN == null)
    throw new Error(AUTHENTICATION_ERRORS.ACCESS_TOKEN_MISSING);

  const req = request(global.app!)
    .post(`${baseUrl}`)
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
    .delete(`${baseUrl}/${id}`)
      .set("Cookie", [global.ACCESS_TOKEN])
      .set("Content-Type", "application/json");
   
  return req.send();
}

export async function getEmployeeAsync(id: string) {

  if(global.ACCESS_TOKEN == null)
    throw new Error(AUTHENTICATION_ERRORS.ACCESS_TOKEN_MISSING);

  const req = request(global.app!)
    .get(`${baseUrl}/${id}`)
      .set("Cookie", [global.ACCESS_TOKEN])
      .set("Content-Type", "application/json");
   
  return req.send();
}

export async function postEmployeePhotoAsync(filePath: string, id: string) {
 
  if(global.ACCESS_TOKEN == null)
    throw new Error(AUTHENTICATION_ERRORS.ACCESS_TOKEN_MISSING); 

  return request(global.app!)
        .post(`${baseUrl}/photo/upload/${id}`)
          .set("Cookie", [global.ACCESS_TOKEN])
          .attach('photoFile', filePath); 
} 

export async function getSearchEmployeesAsync(params?: { keyword:string, departmentId: string, page: number, pageSize: number }) {
  
  const keyword = params?.keyword ?? '';
  const departmentId = params?.departmentId ?? '';
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? PAGE_SIZE; 

  if (!global.ACCESS_TOKEN)
    throw new Error(AUTHENTICATION_ERRORS.ACCESS_TOKEN_MISSING);

  return request(global.app!)
    .get(`${baseUrl}/search?keyword=${keyword}&departmentId=${departmentId}&page=${page}&pageSize=${pageSize}`)
    .set("Cookie", [global.ACCESS_TOKEN]);
}

export async function putEmployeeAsync(id?: string, data?: EmployeeRequest) {
 
  if(global.ACCESS_TOKEN == null)
    throw new Error(AUTHENTICATION_ERRORS.ACCESS_TOKEN_MISSING);

  const req = request(global.app!)
    .put(`${baseUrl}/${id}`)
      .set("Cookie", [global.ACCESS_TOKEN])
      .set("Content-Type", "application/json");
  
  if (data !== undefined) {
    return req.send(data);
  }
  return req.send();
} 
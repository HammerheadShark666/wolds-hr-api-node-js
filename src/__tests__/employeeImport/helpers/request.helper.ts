import request from 'supertest';
import { AUTHENTICATION_ERRORS, PAGE_SIZE } from '../../../utils/constants'; 

const baseUrl = '/v1/import/employees';

export async function postImportEmployeeAsync(filePath: string) {
 
  if(global.ACCESS_TOKEN == null)
    throw new Error(AUTHENTICATION_ERRORS.ACCESS_TOKEN_MISSING); 

  return request(global.app!)
        .post(`${baseUrl}`) 
          .set("Cookie", [global.ACCESS_TOKEN])
          .attach('importFile', filePath); 
}

export async function getImportedEmployeesHistoryAsync(params?: { importEmployeesId: string, page: number, pageSize: number }) {
   
  const importEmployeesId = params?.importEmployeesId ?? '';
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? PAGE_SIZE; 

  if (!global.ACCESS_TOKEN)
    throw new Error(AUTHENTICATION_ERRORS.ACCESS_TOKEN_MISSING);

  return request(global.app!)
    .get(`${baseUrl}/history/imported?id=${importEmployeesId}&page=${page}&pageSize=${pageSize}`)
    .set("Cookie", [global.ACCESS_TOKEN]);
}

export async function getImportedEmployeesExistingHistoryAsync(params?: { importEmployeesId: string, page: number, pageSize: number }) {
   
  const importEmployeesId = params?.importEmployeesId ?? '';
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? PAGE_SIZE; 

  if (!global.ACCESS_TOKEN)
    throw new Error(AUTHENTICATION_ERRORS.ACCESS_TOKEN_MISSING);

  return request(global.app!)
    .get(`${baseUrl}/history/existing?id=${importEmployeesId}&page=${page}&pageSize=${pageSize}`)
    .set("Cookie", [global.ACCESS_TOKEN]);
}

export async function getImportedEmployeesErrorHistoryAsync(params?: { importEmployeesId: string, page: number, pageSize: number }) {
   
  const importEmployeesId = params?.importEmployeesId ?? '';
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? PAGE_SIZE; 

  if (!global.ACCESS_TOKEN)
    throw new Error(AUTHENTICATION_ERRORS.ACCESS_TOKEN_MISSING);

  return request(global.app!)
    .get(`${baseUrl}/history/error?id=${importEmployeesId}&page=${page}&pageSize=${pageSize}`)
    .set("Cookie", [global.ACCESS_TOKEN]);
}

export async function deleteImportedEmployeesAsync(importEmployeesId?: string) {

  if(global.ACCESS_TOKEN == null)
    throw new Error(AUTHENTICATION_ERRORS.ACCESS_TOKEN_MISSING);

  const req = request(global.app!)
    .delete(`${baseUrl}/history/${importEmployeesId}`)            
      .set("Cookie", [global.ACCESS_TOKEN])
      .set("Content-Type", "application/json");
    
  return req.send();
}
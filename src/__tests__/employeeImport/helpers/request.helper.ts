import request from 'supertest';
import { AUTHENTICATION_ERRORS, PAGE_SIZE } from '../../../utils/constants';
import { Types } from 'mongoose';

export async function postImportEmployeeAsync(filePath: string) {
 
  if(global.ACCESS_TOKEN == null)
    throw new Error(AUTHENTICATION_ERRORS.ACCESS_TOKEN_MISSING); 

  return request(global.app!)
        .post(`/v1/employees/import`) 
          .set("Cookie", [global.ACCESS_TOKEN])
          .attach('importFile', filePath); 
}

export async function getEmployeeImportHistoryAsync(params?: { employeeImportId: Types.ObjectId, page: number, pageSize: number }) {
   
  const employeeImportId = params?.employeeImportId ?? '';
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? PAGE_SIZE; 

  if (!global.ACCESS_TOKEN)
    throw new Error(AUTHENTICATION_ERRORS.ACCESS_TOKEN_MISSING);

  return request(global.app!)
    .get(`/v1/employees/import/history/imported?employeeImportId=${employeeImportId}&page=${page}&pageSize=${pageSize}`)
    .set("Cookie", [global.ACCESS_TOKEN]);
}

import path from "path";
import request from 'supertest';
import { expectError } from "../../utils/error.helper";
import { deleteEmployeeAsync, postEmployeeAsync, postEmployeePhotoAsync } from "./helpers/request.helper";
import { createEmployee } from "./helpers/db.helper";

let employeeId = ""; 

const EMPLOYEE_NOT_FOUND_ID = "689afebce7fb4bb9ac7607ea"; 

beforeAll(async () => {   
  employeeId = await createEmployee();
});

afterAll(async () => {  
  const res = await deleteEmployeeAsync(employeeId);
  expect(res.status).toBe(200);
  expect(res.body.message).toMatch('Employee deleted');
});

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i; 

describe('Employee Photo Upload (In-Memory)', () => {
  
  it('should upload a file successfully', async () => {

    const filePath = path.join(__dirname, '../files', 'Employee1.jpg');

    if(global.ACCESS_TOKEN == null)
      throw new Error("Access token is missing"); 
  
    const response = await postEmployeePhotoAsync(filePath, employeeId); 
    expect(response.status).toBe(200);    
     
    const [name, ext] = response.body.filename.split('.');

    expect(ext).toBe('jpg');
    expect(uuidRegex.test(name)).toBe(true);
    expect(response.body.id).toBe(employeeId);

  });

  it('should return 404 if employee not found', async () => {

    const filePath = path.join(__dirname, '../files', 'Employee1.jpg');

    if(global.ACCESS_TOKEN == null)
      throw new Error("Access token is missing"); 

    const response = await request(global.app!)
      .post(`/v1/employees/photo/upload/${EMPLOYEE_NOT_FOUND_ID}`)
        .set("Cookie", [global.ACCESS_TOKEN])
        .attach('photoFile', filePath);

    expectError(response, 'Employee not found', 404);
  }); 
});
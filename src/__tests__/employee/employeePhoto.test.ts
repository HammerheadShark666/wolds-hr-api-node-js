import path from "path";
import request from 'supertest'; 
import { expectEmployee } from "./employeeExpectedHelper";
import { EmployeeRequest } from "../../interface/employee"; 
import { expectError } from "../../utils/error.helper";

let employeeId = ""; 

const EMPLOYEE_SURNAME = "Jones";
const EMPLOYEE_FIRST_NAME = "Mandy";
const EMPLOYEE_DOB = new Date("05-23-2000");
const EMPLOYEE_HIRE_DATE = new Date("03-11-2021");
const EMPLOYEE_EMAIL = "test@hotmail.com";
const EMPLOYEE_PHONE_NUMBER = "0177563423"; 
const EMPLOYEE_DEPARTMENT_ID = "687783fbb6fc23ad4cdca63e"; 
const EMPLOYEE_NOT_FOUND_ID = "689afebce7fb4bb9ac7607ea"; 

beforeAll(async () => { 
  
  const response = await postEmployee({ surname: EMPLOYEE_SURNAME, firstName: EMPLOYEE_FIRST_NAME, 
                                        dateOfBirth: EMPLOYEE_DOB, hireDate: EMPLOYEE_HIRE_DATE, email: EMPLOYEE_EMAIL, 
                                        phoneNumber: EMPLOYEE_PHONE_NUMBER, departmentId: EMPLOYEE_DEPARTMENT_ID });
    
  expectEmployee(response.body, { expectedSurname: EMPLOYEE_SURNAME, expectedFirstName: EMPLOYEE_FIRST_NAME, expectedDateOfBirth: EMPLOYEE_DOB, 
                                  expectedHireDate: EMPLOYEE_HIRE_DATE, expectedEmail: EMPLOYEE_EMAIL, expectedPhoneNumber: EMPLOYEE_PHONE_NUMBER, 
                                  expectedDepartmentId: EMPLOYEE_DEPARTMENT_ID });

  employeeId = response.body.id; 
});

afterAll(async () => {  
  const res = await deleteEmployee(employeeId);
  expect(res.status).toBe(200);
  expect(res.body.message).toMatch('Employee deleted');
});

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i; 

describe('Employee Photo Upload (In-Memory)', () => {
  
  it('should upload a file successfully', async () => {

    const filePath = path.join(__dirname, '../files', 'Employee1.jpg');

    if(global.ACCESS_TOKEN == null)
      throw new Error("Access token is missing"); 

    const res = await request(global.app!)
      .post(`/v1/employees/photo/upload/${employeeId}`)
      .set("Cookie", [global.ACCESS_TOKEN])
      .attach('photoFile', filePath);

    expect(res.status).toBe(200);    
     
    const [name, ext] = res.body.filename.split('.');

    expect(ext).toBe('jpg');
    expect(uuidRegex.test(name)).toBe(true);
    expect(res.body.id).toBe(employeeId);

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
 

function postEmployeePhoto(filePath: string, id: string) {
 
  if(global.ACCESS_TOKEN == null)
    throw new Error("Access token is missing"); 

  return request(global.app!)
    .post(`/v1/employees/photo/upload`)
      .set("Cookie", [global.ACCESS_TOKEN])
      .attach('photoFile', filePath, 'Employee1.jpg');   
}

function postEmployee(data?: EmployeeRequest) {
 
  if(global.ACCESS_TOKEN == null)
    throw new Error("Access token is missing");

  const req = request(global.app!)
    .post("/v1/employees")
      .set("Cookie", [global.ACCESS_TOKEN])
      .set("Content-Type", "application/json");
  
  if (data !== undefined) {
    return req.send(data);
  }
  return req.send();
}
  
function deleteEmployee(id: string) {

  if(global.ACCESS_TOKEN == null)
    throw new Error("Access token is missing");

  const req = request(global.app!)
    .delete("/v1/employees/" + id)
      .set("Cookie", [global.ACCESS_TOKEN])
      .set("Content-Type", "application/json");
   
  return req.send();
}
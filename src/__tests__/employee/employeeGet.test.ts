import request from 'supertest';
import { EmployeeRequest } from '../../interface/employee';
import { expectError } from '../../utils/error.helper';
import { expectEmployee } from './employeeExpectedHelper';

let employeeId = '';

const EMPLOYEE_SURNAME = "Jones";
const EMPLOYEE_FIRST_NAME = "Mandy";
const EMPLOYEE_DOB = new Date("05-23-2000");
const EMPLOYEE_HIRE_DATE = new Date("03-11-2021");
const EMPLOYEE_EMAIL = "test@hotmail.com";
const EMPLOYEE_PHONE_NUMBER = "0177563423"; 
const EMPLOYEE_DEPARTMENT_ID = "687783fbb6fc23ad4cdca63e";
const EMPLOYEE_NOT_FOUND_ID = "68973949b5282483aa4f9ff8";
const EMPLOYEE_INVALID_ID = "68973949b5282483aa4f9";

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

describe("GET /api/v1/employees", () => {

  it("should return 200 and employee when found successfully", async () => {
      const response = await getEmployee(employeeId); 
      expect(response.status).toBe(200);

      expectEmployee(response.body, { expectedSurname: EMPLOYEE_SURNAME, expectedFirstName: EMPLOYEE_FIRST_NAME, expectedDateOfBirth: EMPLOYEE_DOB, 
                                      expectedHireDate: EMPLOYEE_HIRE_DATE, expectedEmail: EMPLOYEE_EMAIL, expectedPhoneNumber: EMPLOYEE_PHONE_NUMBER, 
                                      expectedDepartmentId: EMPLOYEE_DEPARTMENT_ID });
  });

  it("should return 400 when invalid id passed", async () => {
      const response = await getEmployee(EMPLOYEE_INVALID_ID);  
      expectError(response, 'Invalid Id', 400);
  });

  it("should return 404 when id that does not exist is passed", async () => {
      const response = await getEmployee(EMPLOYEE_NOT_FOUND_ID);  
      expectError(response, 'Employee not found', 404);
  });
});

//Api functions

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

function getEmployee(id: string) {

  if(global.ACCESS_TOKEN == null)
    throw new Error("Access token is missing");

  const req = request(global.app!)
    .get("/v1/employees/" + id)
      .set("Cookie", [global.ACCESS_TOKEN])
      .set("Content-Type", "application/json");
   
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
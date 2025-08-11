import request from 'supertest';
import { EmployeeRequest, EmployeeResponse } from '../../interface/employee';
import { expectError } from '../../utils/error.helper';
import { expectEmployee } from './employeeExpectedHelper';

let employeeId = '';

const EMPLOYEE_SURNAME = "Jones";
const EMPLOYEE_SURNAME_OVERSIZED = "OversizedSurnameOversizedSurnameOversizedSurname";
const EMPLOYEE_FIRST_NAME = "Mandy";
const EMPLOYEE_FIRST_NAME_OVERSIZED = "OversizedFirstNameOversizedFirstNameOversizedFirstName";
const EMPLOYEE_DOB = new Date("05-23-2000");
const EMPLOYEE_HIRE_DATE = new Date("03-11-2021");
const EMPLOYEE_EMAIL = "test@hotmail.com";
const EMPLOYEE_INVALID_EMAIL = "testhotmail";
const EMPLOYEE_INVALID_EMAIL_TOO_LONG = "testhotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmail";
const EMPLOYEE_PHONE_NUMBER = "0177563423";
const EMPLOYEE_DEPARTMENT_ID = "687783fbb6fc23ad4cdca63e";
const EMPLOYEE_INVALID_PHONE_NUMBER = "0177563423545623545365645645645";
const EMPLOYEE_INVALID_DEPARTMENT_ID = "687783fbb6fc23ad4cd";
const EMPLOYEE_NOT_FOUND_DEPARTMENT_ID = "687783fbb6fc23ad4cdca64f";

describe("POST /api/v1/employees", () => {

  it("should return 200 when added successfully", async () => {
    
    const addEmployeeRequest: EmployeeRequest = { surname: EMPLOYEE_SURNAME, firstName: EMPLOYEE_FIRST_NAME, 
                                                     dateOfBirth: EMPLOYEE_DOB, hireDate: EMPLOYEE_HIRE_DATE, email: EMPLOYEE_EMAIL, 
                                                     phoneNumber: EMPLOYEE_PHONE_NUMBER, departmentId: EMPLOYEE_DEPARTMENT_ID }

    const response = await postEmployee(addEmployeeRequest); 

    expectEmployee(response.body, { expectedSurname: EMPLOYEE_SURNAME, expectedFirstName: EMPLOYEE_FIRST_NAME, expectedDateOfBirth: EMPLOYEE_DOB, 
                                    expectedHireDate: EMPLOYEE_HIRE_DATE, expectedEmail: EMPLOYEE_EMAIL, 
                                    expectedPhoneNumber: EMPLOYEE_PHONE_NUMBER, expectedDepartmentId: EMPLOYEE_DEPARTMENT_ID }); 

    employeeId = response.body.id; 
  });

  it("should return 400 when surname/first name too big", async () => {
    const addEmployeeRequest: EmployeeRequest = { surname
      : EMPLOYEE_SURNAME_OVERSIZED, firstName: EMPLOYEE_FIRST_NAME_OVERSIZED }
    const response = await postEmployee(addEmployeeRequest);
    expectError(response, 'Surname must be at most 25 characters long', 400);
    expectError(response, 'First name must be at most 25 characters long', 400);
  });

  it("should return 400 when surname/first name not entered", async () => {
    const addEmployeeRequest: EmployeeRequest = { surname: "", firstName: "" }
    const response = await postEmployee(addEmployeeRequest);
    expectError(response, 'Surname is required', 400);
    expectError(response, 'First name is required', 400);
  });

  it("should return 400 when email invalid", async () => {
    const addEmployeeRequest: EmployeeRequest = { surname: EMPLOYEE_SURNAME, firstName: EMPLOYEE_FIRST_NAME, email: EMPLOYEE_INVALID_EMAIL }
    const response = await postEmployee(addEmployeeRequest); 
    expectError(response, 'Invalid email format', 400);
  });

  it("should return 400 when email too long", async () => {
    const addEmployeeRequest: EmployeeRequest = { surname: EMPLOYEE_SURNAME, firstName: EMPLOYEE_FIRST_NAME, email: EMPLOYEE_INVALID_EMAIL_TOO_LONG }
    const response = await postEmployee(addEmployeeRequest); 
    expectError(response, 'Invalid email format', 400);
  });

  it("should return 400 when phone number too long", async () => {
    const addEmployeeRequest: EmployeeRequest = { surname: EMPLOYEE_SURNAME, firstName: EMPLOYEE_FIRST_NAME, phoneNumber: EMPLOYEE_INVALID_PHONE_NUMBER}
    const response = await postEmployee(addEmployeeRequest); 
    expectError(response, 'Phone number must be less than or equal to 25 characters', 400); 
  });

  it("should return 400 when department id is not a valid id", async () => {
    const addEmployeeRequest: EmployeeRequest = { surname: EMPLOYEE_SURNAME, firstName: EMPLOYEE_FIRST_NAME, departmentId: EMPLOYEE_INVALID_DEPARTMENT_ID}
    const response = await postEmployee(addEmployeeRequest); 
    expectError(response, 'Invalid department Id', 400); 
  });

  it("should return 400 when department id not found", async () => {
    const addEmployeeRequest: EmployeeRequest = { surname: EMPLOYEE_SURNAME, firstName: EMPLOYEE_FIRST_NAME, departmentId: EMPLOYEE_NOT_FOUND_DEPARTMENT_ID}
    const response = await postEmployee(addEmployeeRequest); 
    expectError(response, 'Department not found', 404); 
  });  
});
  
describe("DELETE /api/v1/employees", () => {
 
   it("should return 200 and message when deleted", async () => {   
    const res = await deleteEmployee(employeeId);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch('Employee deleted');
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

function deleteEmployee(id: string) {

  if(global.ACCESS_TOKEN == null)
    throw new Error("Access token is missing");

  const req = request(global.app!)
    .delete("/v1/employees/" + id)
      .set("Cookie", [global.ACCESS_TOKEN])
      .set("Content-Type", "application/json");
   
  return req.send();
}
import request from 'supertest';   
import { expectError } from '../utils/error.helper';
import { UpdatedEmployeeResponse, UpdateEmployeeRequest } from '../interface/employee';  

let employeeId = '';
 
const EMPLOYEE_SURNAME = "Hawkins";
const UPDATE_EMPLOYEE_SURNAME = "Harrison";
const EMPLOYEE_SURNAME_OVERSIZED = "OversizedSurnameOversizedSurnameOversizedSurname";
const EMPLOYEE_FIRST_NAME = "Neil"
const UPDATE_EMPLOYEE_FIRST_NAME = "James"
const EMPLOYEE_FIRST_NAME_OVERSIZED = "OversizedFirstNameOversizedFirstNameOversizedFirstName";
const EMPLOYEE_DOB = new Date("10-13-2001");
const EMPLOYEE_HIRE_DATE = new Date("11-27-2022");
const EMPLOYEE_EMAIL = "test@hotmail.com";
const UPDATE_EMPLOYEE_DOB = new Date("05-23-2000");
const UPDATE_EMPLOYEE_HIRE_DATE = new Date("03-11-2021");
const UPDATE_EMPLOYEE_EMAIL = "test@hotmail.com";
const EMPLOYEE_INVALID_EMAIL = "testhotmail";
const EMPLOYEE_INVALID_EMAIL_TOO_LONG = "testhotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmail";
const UPDATE_EMPLOYEE_PHONE_NUMBER = "0177563423";
const UPDATE_EMPLOYEE_DEPARTMENT_ID = "687783fbb6fc23ad4cdca63b";
const EMPLOYEE_PHONE_NUMBER = "0177563423";
const EMPLOYEE_DEPARTMENT_ID = "687783fbb6fc23ad4cdca63e";
const EMPLOYEE_INVALID_PHONE_NUMBER = "0177563423545623545365645645645";
const EMPLOYEE_INVALID_DEPARTMENT_ID = "687783fbb6fc23ad4cd";
const EMPLOYEE_NOT_FOUND_DEPARTMENT_ID = "687783fbb6fc23ad4cdca64f";
const EMPLOYEE_NOT_FOUND_ID = "68973949b5282483aa4f9ff8";

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

describe("PUT /api/v1/employees", () => {

  it("should return 200 when updated successfully", async () => {
    
    const updateEmployeeRequest: UpdateEmployeeRequest = { surname: UPDATE_EMPLOYEE_SURNAME, firstName: UPDATE_EMPLOYEE_FIRST_NAME, 
                                                     dateOfBirth: UPDATE_EMPLOYEE_DOB, hireDate: UPDATE_EMPLOYEE_HIRE_DATE, email: UPDATE_EMPLOYEE_EMAIL, 
                                                     phoneNumber: UPDATE_EMPLOYEE_PHONE_NUMBER, departmentId: UPDATE_EMPLOYEE_DEPARTMENT_ID }
    const response = await putEmployee(employeeId, updateEmployeeRequest); 

    expectEmployee(response.body, { expectedSurname: UPDATE_EMPLOYEE_SURNAME, expectedFirstName: UPDATE_EMPLOYEE_FIRST_NAME, expectedDateOfBirth: UPDATE_EMPLOYEE_DOB, 
                                    expectedHireDate: UPDATE_EMPLOYEE_HIRE_DATE, expectedEmail: UPDATE_EMPLOYEE_EMAIL, expectedPhoneNumber: UPDATE_EMPLOYEE_PHONE_NUMBER, expectedDepartmentId: UPDATE_EMPLOYEE_DEPARTMENT_ID });
 
    employeeId = response.body.id;
  });

  it("should return 404 when employee id not found", async () => {
    const updateEmployeeRequest: UpdateEmployeeRequest = { surname: UPDATE_EMPLOYEE_SURNAME, firstName: UPDATE_EMPLOYEE_FIRST_NAME }
    const response = await putEmployee(EMPLOYEE_NOT_FOUND_ID, updateEmployeeRequest);
    expectError(response, 'Employee not found', 404);
  });

  it("should return 400 when surname/first name too big", async () => {
    const updateEmployeeRequest: UpdateEmployeeRequest = { surname
      : EMPLOYEE_SURNAME_OVERSIZED, firstName: EMPLOYEE_FIRST_NAME_OVERSIZED }
    const response = await putEmployee(employeeId, updateEmployeeRequest);
    expectError(response, 'Surname must be at most 25 characters long', 400);
    expectError(response, 'First name must be at most 25 characters long', 400);
  });

  it("should return 400 when surname/first name not entered", async () => {
    const updateEmployeeRequest: UpdateEmployeeRequest = { surname: "", firstName: "" }
    const response = await putEmployee(employeeId, updateEmployeeRequest);
    expectError(response, 'Surname is required', 400);
    expectError(response, 'First name is required', 400);
  });

  it("should return 400 when email invalid", async () => {
    const updateEmployeeRequest: UpdateEmployeeRequest = { surname: EMPLOYEE_SURNAME, firstName: EMPLOYEE_FIRST_NAME, email: EMPLOYEE_INVALID_EMAIL }
    const response = await putEmployee(employeeId, updateEmployeeRequest); 
    expectError(response, 'Invalid email format', 400);
  });

  it("should return 400 when email too long", async () => {
    const updateEmployeeRequest: UpdateEmployeeRequest = { surname: EMPLOYEE_SURNAME, firstName: EMPLOYEE_FIRST_NAME, email: EMPLOYEE_INVALID_EMAIL_TOO_LONG }
    const response = await putEmployee(employeeId, updateEmployeeRequest); 
    expectError(response, 'Invalid email format', 400);
  });

  it("should return 400 when phone number too long", async () => {
    const updateEmployeeRequest: UpdateEmployeeRequest = { surname: EMPLOYEE_SURNAME, firstName: EMPLOYEE_FIRST_NAME, phoneNumber: EMPLOYEE_INVALID_PHONE_NUMBER}
    const response = await putEmployee(employeeId, updateEmployeeRequest); 
    expectError(response, 'Phone number must be less than or equal to 25 characters', 400); 
  });

  it("should return 400 when department id is not a valid id", async () => {
    const updateEmployeeRequest: UpdateEmployeeRequest = { surname: EMPLOYEE_SURNAME, firstName: EMPLOYEE_FIRST_NAME, departmentId: EMPLOYEE_INVALID_DEPARTMENT_ID}
    const response = await putEmployee(employeeId, updateEmployeeRequest); 
    expectError(response, 'Invalid department Id', 400); 
  });

  it("should return 400 when department id not found", async () => {
    const updateEmployeeRequest: UpdateEmployeeRequest = { surname: EMPLOYEE_SURNAME, firstName: EMPLOYEE_FIRST_NAME, departmentId: EMPLOYEE_NOT_FOUND_DEPARTMENT_ID}
    const response = await putEmployee(employeeId, updateEmployeeRequest); 
    expectError(response, 'Department not found', 404); 
  });  
}); 

//Api functions 

function postEmployee(data?: UpdateEmployeeRequest) {
 
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

function putEmployee(id?: string, data?: UpdateEmployeeRequest) {
 
  if(global.ACCESS_TOKEN == null)
    throw new Error("Access token is missing");

  const req = request(global.app!)
    .put("/v1/employees/" + id)
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
 
//Helpers
 
type ExpectEmployeeOptions = {
  expectedSurname?: string;
  expectedFirstName?: string;
  expectedDateOfBirth?: Date;
  expectedHireDate?: Date;
  expectedEmail?: string;
  expectedPhoneNumber?: string;
  expectedDepartmentId?: string;
};

function expectEmployee(employee: Partial<UpdatedEmployeeResponse>, options: ExpectEmployeeOptions = {}) {
  expect(employee).toBeDefined();
  expect(employee).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      surname: expect.any(String),
      firstName: expect.any(String),
      dateOfBirth: expect.any(String),
      hireDate: expect.any(String),
      email: expect.any(String),
      phoneNumber: employee.phoneNumber,
      photo: employee.photo,
      department: expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String)
      })
    })
  );

  expect([null, expect.any(String)]).toContainEqual(employee.phoneNumber);
  expect([null, expect.any(String)]).toContainEqual(employee.photo);

  if (options.expectedSurname !== undefined) {
    expect(employee.surname).toBe(options.expectedSurname);
  }

  if (options.expectedFirstName !== undefined) {
    expect(employee.firstName).toBe(options.expectedFirstName);
  }
}
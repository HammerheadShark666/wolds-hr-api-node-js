import request from 'supertest';   
import { expectError } from '../utils/error.helper';
import { AddEmployeeRequest, AddEmployeeResponse } from '../interface/employee';
import { number } from 'zod';

let employeeId = '';

const EMPLOYEE_SURNAME = "Jones";
const EMPLOYEE_SURNAME_OVERSIZED = "OversizedSurnameOversizedSurnameOversizedSurname";
const EMPLOYEE_FIRST_NAME = "Mandy"
const EMPLOYEE_FIRST_NAME_OVERSIZED = "OversizedFirstNameOversizedFirstNameOversizedFirstName";
const EMPLOYEE_DOB = new Date("05-23-2000");
const EMPLOYEE_HIRE_DATE = new Date("03-11-2021");
const EMPLOYEE_EMAIL = "test@hotmail.com";
const EMPLOYEE_INVALID_EMAIL = "testhotmail";
const EMPLOYEE_INVALID_EMAIL_TOO_LONG = "testhotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmail";

describe("POST /api/v1/employees", () => {
  it("should return 200 when added successfully", async () => {
    const addEmployeeRequest: AddEmployeeRequest = { surname: EMPLOYEE_SURNAME, firstName: EMPLOYEE_FIRST_NAME, dateOfBirth: EMPLOYEE_DOB, hireDate: EMPLOYEE_HIRE_DATE, email: EMPLOYEE_EMAIL }
    const response = await postEmployee(addEmployeeRequest);


    console.log("response = ", response)


    expectEmployee(response.body, { expectedSurname: EMPLOYEE_SURNAME, expectedFirstName: EMPLOYEE_FIRST_NAME, expectedDateOfBirth: EMPLOYEE_DOB, 
                                    expectedHireDate: EMPLOYEE_HIRE_DATE, expectedEmail: EMPLOYEE_EMAIL });
    employeeId = response.body.id;
  });

  it("should return 400 when surname/first name too big", async () => {
    const addEmployeeRequest: AddEmployeeRequest = { surname
      : EMPLOYEE_SURNAME_OVERSIZED, firstName: EMPLOYEE_FIRST_NAME_OVERSIZED }
    const response = await postEmployee(addEmployeeRequest);
    expectError(response, 'Surname, maximum size is 25', 400);
    expectError(response, 'First name, maximum size is 25', 400);
  });

  it("should return 400 when surname/first name not entered", async () => {
    const addEmployeeRequest: AddEmployeeRequest = { surname: "", firstName: "" }
    const response = await postEmployee(addEmployeeRequest);
    expectError(response, 'Surname is required', 400);
    expectError(response, 'First name is required', 400);
  });

  it("should return 400 when email invalid", async () => {
    const addEmployeeRequest: AddEmployeeRequest = { surname: EMPLOYEE_SURNAME, firstName: EMPLOYEE_FIRST_NAME, email: EMPLOYEE_INVALID_EMAIL }
    const response = await postEmployee(addEmployeeRequest); 
    expectError(response, 'Invalid email format', 400);
  });

  it("should return 400 when email too long", async () => {
    const addEmployeeRequest: AddEmployeeRequest = { surname: EMPLOYEE_SURNAME, firstName: EMPLOYEE_FIRST_NAME, email: EMPLOYEE_INVALID_EMAIL_TOO_LONG }
    const response = await postEmployee(addEmployeeRequest); 
    expectError(response, 'Invalid email format', 400);
  });

  //phone number
  //photo
  //department

  //  it("should return 400 when date of birth not a date", async () => {
  //   const addEmployeeRequest: AddEmployeeRequest = { surname: EMPLOYEE_SURNAME, firstName: EMPLOYEE_FIRST_NAME, dateOfBirth: EMPLOYEE_DOB}
  //   const response = await postEmployee(addEmployeeRequest); 

  //   console.log("response = ", response)
  //   expectError(response, 'First name is required', 400);
  // });
 
});

describe("DELETE /api/v1/employees", () => {

   it("should return 200 and message when deleted", async () => {
    const res = await deleteEmployee(employeeId);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch('Employee deleted');
  });

});


//Api functions 

function postEmployee(data?: AddEmployeeRequest) {
 
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
 
//Helpers
 
type ExpectEmployeeOptions = {
  expectedSurname?: string;
  expectedFirstName?: string;
  expectedDateOfBirth?: Date;
  expectedHireDate?: Date;
  expectedEmail?: string;
};

function expectEmployee(employee: Partial<AddEmployeeResponse>, options: ExpectEmployeeOptions = {}) {


  console.log("expectEmployee - ", employee)


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
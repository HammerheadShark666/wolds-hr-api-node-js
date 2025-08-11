import request from 'supertest';
import { AddEmployeeRequest, AddEmployeeResponse } from '../../interface/employee';
import { expectError } from '../../utils/error.helper';

let employeeId = '';

const EMPLOYEE_SURNAME = "Jones";
const EMPLOYEE_FIRST_NAME = "Mandy";
const EMPLOYEE_NOT_FOUND_ID = "68973949b5282483aa4f9ff8";
const EMPLOYEE_INVALID_ID = "68973949b5282483aa4f9";

beforeAll(async () => { 
  
  const response = await postEmployee({ surname: EMPLOYEE_SURNAME, firstName: EMPLOYEE_FIRST_NAME });  
  expectEmployee(response.body, { expectedSurname: EMPLOYEE_SURNAME, expectedFirstName: EMPLOYEE_FIRST_NAME });

  employeeId = response.body.id;
});

describe("DELETE /api/v1/employees", () => {

  it("should return 200 when deleted successfully", async () => {
      const response = await deleteEmployee(employeeId); 
      expect(response.status).toBe(200);
  });

  it("should return 400 when invalid id passed", async () => {
      const response = await deleteEmployee(EMPLOYEE_INVALID_ID);  
      expectError(response, 'Invalid Id', 400);
  });

  it("should return 404 when id that does not exist is passed", async () => {
      const response = await deleteEmployee(EMPLOYEE_NOT_FOUND_ID);  
      expectError(response, 'Employee not found', 404);
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
  expect(employee).toBeDefined();
  expect(employee).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      surname: expect.any(String),
      firstName: expect.any(String)
    })
  );

  if (options.expectedSurname !== undefined) {
    expect(employee.surname).toBe(options.expectedSurname);
  }

  if (options.expectedFirstName !== undefined) {
    expect(employee.firstName).toBe(options.expectedFirstName);
  }
}
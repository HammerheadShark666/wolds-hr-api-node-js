// import { expectError } from '../../utils/error.helper';
// import { createEmployee } from './helpers/db.helper';;
// import { deleteEmployeeAsync, postEmployeeAsync } from './helpers/request.helper';

// let employeeId = '';

// const EMPLOYEE_NOT_FOUND_ID = "68973949b5282483aa4f9ff8";
// const EMPLOYEE_INVALID_ID = "68973949b5282483aa4f9";

// beforeAll(async () => {
//   employeeId = await createEmployee();
// });

// describe("DELETE /api/v1/employees", () => {

//   it("should return 200 when deleted successfully", async () => {
//       const response = await deleteEmployeeAsync(employeeId); 
//       expect(response.status).toBe(200);
//   });

//   it("should return 400 when invalid id passed", async () => {
//       const response = await deleteEmployeeAsync(EMPLOYEE_INVALID_ID);  
//       expectError(response, 'Invalid Id', 400);
//   });

//   it("should return 404 when id that does not exist is passed", async () => {
//       const response = await deleteEmployeeAsync(EMPLOYEE_NOT_FOUND_ID);  
//       expectError(response, 'Employee not found', 404);
//   });
// });


import { expectError } from '../../utils/error.helper';
import { createEmployee } from './helpers/db.helper';
import { deleteEmployeeAsync, postEmployeeAsync } from './helpers/request.helper';

const TEST_IDS = {
  notFound: "68973949b5282483aa4f9ff8",
  invalid: "68973949b5282483aa4f9",
};

const testContext: { employeeId?: string } = {};

beforeAll(async () => {
  testContext.employeeId = await createEmployee();
});

afterAll(async () => {
  if (testContext.employeeId) {
    await deleteEmployeeAsync(testContext.employeeId);
    testContext.employeeId = undefined;
  }
});

describe("DELETE /api/v1/employees", () => {
  it("should return 200 when deleted successfully", async () => {
    const response = await deleteEmployeeAsync(testContext.employeeId!);
    expect(response.status).toBe(200);
    testContext.employeeId = undefined; // prevent double-delete
  });

  it.each([
    { id: TEST_IDS.invalid, expectedMessage: "Invalid Id", expectedStatus: 400 },
    { id: TEST_IDS.notFound, expectedMessage: "Employee not found", expectedStatus: 404 },
  ])("should return $expectedStatus when id $id is invalid or not found", async ({ id, expectedMessage, expectedStatus }) => {
    const response = await deleteEmployeeAsync(id);
    expectError(response, expectedMessage, expectedStatus);
  });
});
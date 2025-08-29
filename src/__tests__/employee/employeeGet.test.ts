// import { expectError } from '../../utils/error.helper';
// import { createEmployee } from './helpers/db.helper';
// import { expectEmployee } from './helpers/expected.helper';
// import { deleteEmployeeAsync, getEmployeeAsync } from './helpers/request.helper';
// import { getDepartmentByNameAsync } from '../department/helpers/request.helper';
// import { EMPLOYEE_TEST } from './helpers/constants';

// let employeeId = '';

// const EMPLOYEE_NOT_FOUND_ID = "68973949b5282483aa4f9ff8";
// const EMPLOYEE_INVALID_ID = "68973949b5282483aa4f9";

// beforeAll(async () => { 
//   employeeId = await createEmployee();
// });

// afterAll(async () => {  
//   const res = await deleteEmployeeAsync(employeeId);
//   expect(res.status).toBe(200);
//   expect(res.body.message).toMatch('Employee deleted');
// });

// describe("GET /api/v1/employees", () => {

//   it("should return 200 and employee when found successfully", async () => {

//       const expectedDepartmentId = await getDepartmentByNameAsync(EMPLOYEE_TEST.DEPARTMENT_NAME_MARKETING);

//       const response = await getEmployeeAsync(employeeId); 
//       expect(response.status).toBe(200);

//       expectEmployee(response.body, { expectedSurname: EMPLOYEE_TEST.EMPLOYEE_SURNAME, expectedFirstName: EMPLOYEE_TEST.EMPLOYEE_FIRST_NAME, expectedDateOfBirth: EMPLOYEE_TEST.EMPLOYEE_DOB, 
//                                       expectedHireDate: EMPLOYEE_TEST.EMPLOYEE_HIRE_DATE, expectedEmail: EMPLOYEE_TEST.EMPLOYEE_EMAIL, expectedPhoneNumber: EMPLOYEE_TEST.EMPLOYEE_PHONE_NUMBER, 
//                                       expectedDepartmentId: expectedDepartmentId.toString() });
//   });

//   it("should return 400 when invalid id passed", async () => {
//       const response = await getEmployeeAsync(EMPLOYEE_INVALID_ID);  
//       expectError(response, 'Invalid Id', 400);
//   });

//   it("should return 404 when id that does not exist is passed", async () => {
//       const response = await getEmployeeAsync(EMPLOYEE_NOT_FOUND_ID);  
//       expectError(response, 'Employee not found', 404);
//   });
// });

import { expectError } from '../../utils/error.helper';
import { createEmployee } from './helpers/db.helper';
import { expectEmployee } from './helpers/expected.helper';
import { deleteEmployeeAsync, getEmployeeAsync } from './helpers/request.helper';
import { getDepartmentByNameAsync } from '../department/helpers/request.helper';
import { EMPLOYEE_TEST, EMPLOYEE_TEST_DATA } from './helpers/constants';

const TEST_IDS = {
  invalid: "68973949b5282483aa4f9",
  notFound: "68973949b5282483aa4f9ff8",
};

const testContext: { employeeId?: string } = {};

beforeAll(async () => {
  testContext.employeeId = await createEmployee();
});

afterAll(async () => {
  if (testContext.employeeId) {
    const res = await deleteEmployeeAsync(testContext.employeeId);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch("Employee deleted");
    testContext.employeeId = undefined;
  }
});

describe("GET /api/v1/employees/:id", () => {
  it("should return 200 and employee when found successfully", async () => {
    const expectedDepartmentId = await getDepartmentByNameAsync(EMPLOYEE_TEST.DEPARTMENT_NAME_MARKETING);

    const res = await getEmployeeAsync(testContext.employeeId!);
    expect(res.status).toBe(200);

    expectEmployee(res.body, {
      expectedSurname: EMPLOYEE_TEST_DATA.VALID.surname,
      expectedFirstName: EMPLOYEE_TEST_DATA.VALID.firstName,
      expectedDateOfBirth: EMPLOYEE_TEST_DATA.VALID.dateOfBirth,
      expectedHireDate: EMPLOYEE_TEST_DATA.VALID.hireDate,
      expectedEmail: EMPLOYEE_TEST_DATA.VALID.email,
      expectedPhoneNumber: EMPLOYEE_TEST_DATA.VALID.phoneNumber,
      expectedDepartmentId: expectedDepartmentId.toString(),
    });
  });

  it.each([
    { id: TEST_IDS.invalid, expectedMessage: "Invalid Id", expectedStatus: 400 },
    { id: TEST_IDS.notFound, expectedMessage: "Employee not found", expectedStatus: 404 },
  ])("should return $expectedStatus when id $id is invalid or not found", async ({ id, expectedMessage, expectedStatus }) => {
    const res = await getEmployeeAsync(id);
    expectError(res, expectedMessage, expectedStatus);
  });
});
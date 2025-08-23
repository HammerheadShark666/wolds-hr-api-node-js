import { expectError } from '../../utils/error.helper';
import { createEmployee } from './helpers/db.helper';
import { expectEmployee } from './helpers/expected.helper';
import { deleteEmployeeAsync, getEmployeeAsync } from './helpers/request.helper';
import { DEPARTMENT_NAME_MARKETING, EMPLOYEE_DOB, EMPLOYEE_EMAIL, EMPLOYEE_FIRST_NAME, EMPLOYEE_HIRE_DATE, EMPLOYEE_PHONE_NUMBER, EMPLOYEE_SURNAME } from './helpers/constants';
import { getDepartmentByNameAsync } from '../department/helpers/request.helper';

let employeeId = '';

const EMPLOYEE_NOT_FOUND_ID = "68973949b5282483aa4f9ff8";
const EMPLOYEE_INVALID_ID = "68973949b5282483aa4f9";

beforeAll(async () => { 
  employeeId = await createEmployee();
});

afterAll(async () => {  
  const res = await deleteEmployeeAsync(employeeId);
  expect(res.status).toBe(200);
  expect(res.body.message).toMatch('Employee deleted');
});

describe("GET /api/v1/employees", () => {

  it("should return 200 and employee when found successfully", async () => {

      const expectedDepartmentId = await getDepartmentByNameAsync(DEPARTMENT_NAME_MARKETING);

      const response = await getEmployeeAsync(employeeId); 
      expect(response.status).toBe(200);

      expectEmployee(response.body, { expectedSurname: EMPLOYEE_SURNAME, expectedFirstName: EMPLOYEE_FIRST_NAME, expectedDateOfBirth: EMPLOYEE_DOB, 
                                      expectedHireDate: EMPLOYEE_HIRE_DATE, expectedEmail: EMPLOYEE_EMAIL, expectedPhoneNumber: EMPLOYEE_PHONE_NUMBER, 
                                      expectedDepartmentId: expectedDepartmentId.toString() });
  });

  it("should return 400 when invalid id passed", async () => {
      const response = await getEmployeeAsync(EMPLOYEE_INVALID_ID);  
      expectError(response, 'Invalid Id', 400);
  });

  it("should return 404 when id that does not exist is passed", async () => {
      const response = await getEmployeeAsync(EMPLOYEE_NOT_FOUND_ID);  
      expectError(response, 'Employee not found', 404);
  });
});
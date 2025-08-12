import { expectError } from '../../utils/error.helper';
import { createEmployee } from './helpers/db.helper';;
import { deleteEmployeeAsync, postEmployeeAsync } from './helpers/request.helper';

let employeeId = '';

const EMPLOYEE_NOT_FOUND_ID = "68973949b5282483aa4f9ff8";
const EMPLOYEE_INVALID_ID = "68973949b5282483aa4f9";

beforeAll(async () => {
  employeeId = await createEmployee();
});

describe("DELETE /api/v1/employees", () => {

  it("should return 200 when deleted successfully", async () => {
      const response = await deleteEmployeeAsync(employeeId); 
      expect(response.status).toBe(200);
  });

  it("should return 400 when invalid id passed", async () => {
      const response = await deleteEmployeeAsync(EMPLOYEE_INVALID_ID);  
      expectError(response, 'Invalid Id', 400);
  });

  it("should return 404 when id that does not exist is passed", async () => {
      const response = await deleteEmployeeAsync(EMPLOYEE_NOT_FOUND_ID);  
      expectError(response, 'Employee not found', 404);
  });
});
import { expectError } from '../../utils/error.helper';
import { EmployeeRequest } from '../../interface/employee';  
import { expectEmployee } from './helpers/expected.helper';
import { deleteEmployeeAsync, postEmployeeAsync, putEmployeeAsync } from './helpers/request.helper';
import { createEmployee } from './helpers/db.helper';
import { EMPLOYEE_FIRST_NAME, EMPLOYEE_SURNAME } from './helpers/constants';

let employeeId = '';
 
const UPDATE_EMPLOYEE_SURNAME = "Harrison";
const UPDATE_EMPLOYEE_FIRST_NAME = "James"
const UPDATE_EMPLOYEE_DOB = new Date("05-23-2000");
const UPDATE_EMPLOYEE_HIRE_DATE = new Date("03-11-2021");
const UPDATE_EMPLOYEE_EMAIL = "test@hotmail.com";
const UPDATE_EMPLOYEE_PHONE_NUMBER = "0177563423";
const UPDATE_EMPLOYEE_DEPARTMENT_ID = "687783fbb6fc23ad4cdca63b"; 
const EMPLOYEE_SURNAME_OVERSIZED = "OversizedSurnameOversizedSurnameOversizedSurname";
const EMPLOYEE_FIRST_NAME_OVERSIZED = "OversizedFirstNameOversizedFirstNameOversizedFirstName";
const EMPLOYEE_INVALID_EMAIL = "testhotmail";
const EMPLOYEE_INVALID_EMAIL_OVERSIZED = "testhotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmail";
const EMPLOYEE_INVALID_PHONE_NUMBER = "0177563423545623545365645645645";
const EMPLOYEE_INVALID_DEPARTMENT_ID = "687783fbb6fc23ad4cd";
const EMPLOYEE_NOT_FOUND_DEPARTMENT_ID = "687783fbb6fc23ad4cdca64f";
const EMPLOYEE_NOT_FOUND_ID = "68973949b5282483aa4f9ff8";

beforeAll(async () => {  
  employeeId = await createEmployee();
});

afterAll(async () => {  
  const res = await deleteEmployeeAsync(employeeId);
  expect(res.status).toBe(200);
  expect(res.body.message).toMatch('Employee deleted');
});

describe("PUT /api/v1/employees", () => {

  it("should return 200 when updated successfully", async () => {
     
    const response = await putEmployeeAsync(employeeId,{
            surname: UPDATE_EMPLOYEE_SURNAME, 
            firstName: UPDATE_EMPLOYEE_FIRST_NAME, 
            dateOfBirth: UPDATE_EMPLOYEE_DOB, 
            hireDate: UPDATE_EMPLOYEE_HIRE_DATE, 
            email: UPDATE_EMPLOYEE_EMAIL, 
            phoneNumber: UPDATE_EMPLOYEE_PHONE_NUMBER, 
            departmentId: UPDATE_EMPLOYEE_DEPARTMENT_ID
          } satisfies EmployeeRequest);

    expectEmployee(response.body, { expectedSurname: UPDATE_EMPLOYEE_SURNAME, expectedFirstName: UPDATE_EMPLOYEE_FIRST_NAME, expectedDateOfBirth: UPDATE_EMPLOYEE_DOB, 
                                    expectedHireDate: UPDATE_EMPLOYEE_HIRE_DATE, expectedEmail: UPDATE_EMPLOYEE_EMAIL, expectedPhoneNumber: UPDATE_EMPLOYEE_PHONE_NUMBER, expectedDepartmentId: UPDATE_EMPLOYEE_DEPARTMENT_ID });
 
    employeeId = response.body.id;
  });

  it("should return 404 when employee id not found", async () => {
    const updateEmployeeRequest: EmployeeRequest = { surname: UPDATE_EMPLOYEE_SURNAME, firstName: UPDATE_EMPLOYEE_FIRST_NAME }
    const response = await putEmployeeAsync(EMPLOYEE_NOT_FOUND_ID, updateEmployeeRequest);
    expectError(response, 'Employee not found', 404);
  });

  it("should return 400 when surname/first name too big", async () => {
    const updateEmployeeRequest: EmployeeRequest = { surname
      : EMPLOYEE_SURNAME_OVERSIZED, firstName: EMPLOYEE_FIRST_NAME_OVERSIZED }
    const response = await putEmployeeAsync(employeeId, updateEmployeeRequest);
    expectError(response, 'Surname must be at most 25 characters long', 400);
    expectError(response, 'First name must be at most 25 characters long', 400);
  });

  it("should return 400 when surname/first name not entered", async () => {
    const updateEmployeeRequest: EmployeeRequest = { surname: "", firstName: "" }
    const response = await putEmployeeAsync(employeeId, updateEmployeeRequest);
    expectError(response, 'Surname is required', 400);
    expectError(response, 'First name is required', 400);
  });

  it("should return 400 when email invalid", async () => {
    const updateEmployeeRequest: EmployeeRequest = { surname: EMPLOYEE_SURNAME, firstName: EMPLOYEE_FIRST_NAME, email: EMPLOYEE_INVALID_EMAIL }
    const response = await putEmployeeAsync(employeeId, updateEmployeeRequest); 
    expectError(response, 'Invalid email format', 400);
  });

  it("should return 400 when email too long", async () => {
    const updateEmployeeRequest: EmployeeRequest = { surname: EMPLOYEE_SURNAME, firstName: EMPLOYEE_FIRST_NAME, email: EMPLOYEE_INVALID_EMAIL_OVERSIZED }
    const response = await putEmployeeAsync(employeeId, updateEmployeeRequest); 
    expectError(response, 'Invalid email format', 400);
  });

  it("should return 400 when phone number too long", async () => {
    const updateEmployeeRequest: EmployeeRequest = { surname: EMPLOYEE_SURNAME, firstName: EMPLOYEE_FIRST_NAME, phoneNumber: EMPLOYEE_INVALID_PHONE_NUMBER}
    const response = await putEmployeeAsync(employeeId, updateEmployeeRequest); 
    expectError(response, 'Phone number must be less than or equal to 25 characters', 400); 
  });

  it("should return 400 when department id is not a valid id", async () => {
    const updateEmployeeRequest: EmployeeRequest = { surname: EMPLOYEE_SURNAME, firstName: EMPLOYEE_FIRST_NAME, departmentId: EMPLOYEE_INVALID_DEPARTMENT_ID}
    const response = await putEmployeeAsync(employeeId, updateEmployeeRequest); 
    expectError(response, 'Invalid department Id', 400); 
  });

  it("should return 400 when department id not found", async () => {
    const updateEmployeeRequest: EmployeeRequest = { surname: EMPLOYEE_SURNAME, firstName: EMPLOYEE_FIRST_NAME, departmentId: EMPLOYEE_NOT_FOUND_DEPARTMENT_ID}
    const response = await putEmployeeAsync(employeeId, updateEmployeeRequest); 
    expectError(response, 'Department not found', 404); 
  });  
});
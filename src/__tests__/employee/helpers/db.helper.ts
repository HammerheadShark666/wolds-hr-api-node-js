import { expectEmployee } from "./expected.helper";
import { postEmployeeAsync } from "./request.helper";
import { EMPLOYEE_DEPARTMENT_ID, EMPLOYEE_DOB, EMPLOYEE_EMAIL, EMPLOYEE_FIRST_NAME, EMPLOYEE_HIRE_DATE, EMPLOYEE_PHONE_NUMBER, EMPLOYEE_SURNAME } from './constants';
import { EmployeeRequest } from "../../../interface/employee";

export async function createEmployee() {
 
  const response = await postEmployeeAsync({
        surname: EMPLOYEE_SURNAME,
        firstName: EMPLOYEE_FIRST_NAME,
        dateOfBirth: EMPLOYEE_DOB,
        hireDate: EMPLOYEE_HIRE_DATE,
        email: EMPLOYEE_EMAIL,
        phoneNumber: EMPLOYEE_PHONE_NUMBER,
        departmentId: EMPLOYEE_DEPARTMENT_ID
      } satisfies EmployeeRequest);
        
  expectEmployee(response.body, { expectedSurname: EMPLOYEE_SURNAME, expectedFirstName: EMPLOYEE_FIRST_NAME, expectedDateOfBirth: EMPLOYEE_DOB, 
                                  expectedHireDate: EMPLOYEE_HIRE_DATE, expectedEmail: EMPLOYEE_EMAIL, expectedPhoneNumber: EMPLOYEE_PHONE_NUMBER, 
                                  expectedDepartmentId: EMPLOYEE_DEPARTMENT_ID });
  
  return response.body.id;
}
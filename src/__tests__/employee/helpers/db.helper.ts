import { expectEmployee } from "./expected.helper";
import { postEmployeeAsync } from "./request.helper";
import { DEPARTMENT_NAME_MARKETING, EMPLOYEE_DOB, EMPLOYEE_EMAIL, EMPLOYEE_FIRST_NAME, EMPLOYEE_HIRE_DATE, EMPLOYEE_PHONE_NUMBER, EMPLOYEE_SURNAME } from './constants';
import { EmployeeRequest } from "../../../interface/employee";
import { getDepartmentByNameAsync } from "../../department/helpers/request.helper";

export async function createEmployee() {
 
  const expectedDepartmentId = await getDepartmentByNameAsync(DEPARTMENT_NAME_MARKETING);

  const response = await postEmployeeAsync({
        surname: EMPLOYEE_SURNAME,
        firstName: EMPLOYEE_FIRST_NAME,
        dateOfBirth: EMPLOYEE_DOB,
        hireDate: EMPLOYEE_HIRE_DATE,
        email: EMPLOYEE_EMAIL,
        phoneNumber: EMPLOYEE_PHONE_NUMBER,
        departmentId: expectedDepartmentId.toString()
      } satisfies EmployeeRequest);
        
  expectEmployee(response.body, { expectedSurname: EMPLOYEE_SURNAME, expectedFirstName: EMPLOYEE_FIRST_NAME, expectedDateOfBirth: EMPLOYEE_DOB, 
                                  expectedHireDate: EMPLOYEE_HIRE_DATE, expectedEmail: EMPLOYEE_EMAIL, expectedPhoneNumber: EMPLOYEE_PHONE_NUMBER, 
                                  expectedDepartmentId: expectedDepartmentId.toString() });
  
  return response.body.id;
}
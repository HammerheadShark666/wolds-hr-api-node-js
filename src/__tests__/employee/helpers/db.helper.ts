import { expectEmployee } from "./expected.helper";
import { postEmployeeAsync } from "./request.helper";
import { EmployeeRequest } from "../../../interface/employee";
import { getDepartmentByNameAsync } from "../../department/helpers/request.helper";
import { EMPLOYEE_TEST, EMPLOYEE_TEST_DATA } from "./constants";

export async function createEmployee() {
 
  const expectedDepartmentId = await getDepartmentByNameAsync(EMPLOYEE_TEST.DEPARTMENT_NAME_MARKETING);

  const response = await postEmployeeAsync({
        surname: EMPLOYEE_TEST_DATA.VALID.surname,
        firstName: EMPLOYEE_TEST_DATA.VALID.firstName,
        dateOfBirth: EMPLOYEE_TEST_DATA.VALID.dateOfBirth,
        hireDate: EMPLOYEE_TEST_DATA.VALID.hireDate,
        email: EMPLOYEE_TEST_DATA.VALID.email,
        phoneNumber: EMPLOYEE_TEST_DATA.VALID.phoneNumber,
        departmentId: expectedDepartmentId.toString()
      } satisfies EmployeeRequest);
        
  expectEmployee(response.body, { expectedSurname: EMPLOYEE_TEST_DATA.VALID.surname, expectedFirstName: EMPLOYEE_TEST_DATA.VALID.firstName, expectedDateOfBirth: EMPLOYEE_TEST_DATA.VALID.dateOfBirth, 
                                  expectedHireDate: EMPLOYEE_TEST_DATA.VALID.hireDate, expectedEmail: EMPLOYEE_TEST_DATA.VALID.email, expectedPhoneNumber: EMPLOYEE_TEST_DATA.VALID.phoneNumber, 
                                  expectedDepartmentId: expectedDepartmentId.toString() });
  
  return response.body.id;
}
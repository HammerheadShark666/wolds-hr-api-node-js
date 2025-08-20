import { EmployeeRequest, EmployeeResponse } from '../../interface/employee';
import { expectError } from '../../utils/error.helper';
import { expectEmployee } from './helpers/expected.helper';
import { deleteEmployeeAsync, postEmployeeAsync } from './helpers/request.helper';
import { DEPARTMENT_NAME_MARKETING, EMPLOYEE_DOB, EMPLOYEE_EMAIL, EMPLOYEE_FIRST_NAME, EMPLOYEE_HIRE_DATE, EMPLOYEE_PHONE_NUMBER, EMPLOYEE_SURNAME } from './helpers/constants';
import { getEmployeeDepartmentId } from '../../utils/department.helper';
import { DepartmentModel } from '../../models/department.model';
import { constants } from 'buffer';
import { EmployeeModel } from '../../models/employee.model';
import mongoose, { Types } from 'mongoose';

let employeeId = '';

const EMPLOYEE_SURNAME_OVERSIZED = "OversizedSurnameOversizedSurnameOversizedSurname";
const EMPLOYEE_FIRST_NAME_OVERSIZED = "OversizedFirstNameOversizedFirstNameOversizedFirstName";
const EMPLOYEE_INVALID_EMAIL = "testhotmail";
const EMPLOYEE_INVALID_EMAIL_TOO_LONG = "testhotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmail";
const EMPLOYEE_INVALID_PHONE_NUMBER = "0177563423545623545365645645645";
const EMPLOYEE_INVALID_DEPARTMENT_ID = "687783fbb6fc23ad4cd";
const EMPLOYEE_NOT_FOUND_DEPARTMENT_ID = "687783fbb6fc23ad4cdca64f";

describe("POST /api/v1/employees", () => {


  it("should return 200 when added successfully", async () => {

    console.log('readyState:', mongoose.connection.readyState);
    const departmentId = await getEmployeeDepartmentId(DEPARTMENT_NAME_MARKETING);

    //const department = await DepartmentModel.findById(departmentId);

    //const employee = await EmployeeModel.findById(new Types.ObjectId("68a60c7ca539263c336db0e6"));

    //console.log("mployee = ", employee);

    //const department = await DepartmentModel.findOne({ name: DEPARTMENT_NAME_MARKETING });

    //const departmentId = department?.id;
     
    const response = await postEmployeeAsync({
      surname: EMPLOYEE_SURNAME,
      firstName: EMPLOYEE_FIRST_NAME,
      dateOfBirth: EMPLOYEE_DOB,
      hireDate: EMPLOYEE_HIRE_DATE,
      email: EMPLOYEE_EMAIL,
      phoneNumber: EMPLOYEE_PHONE_NUMBER,
      departmentId:departmentId.toString()
    } satisfies EmployeeRequest);

    expectEmployee(response.body, { expectedSurname: EMPLOYEE_SURNAME, expectedFirstName: EMPLOYEE_FIRST_NAME, expectedDateOfBirth: EMPLOYEE_DOB, 
                                    expectedHireDate: EMPLOYEE_HIRE_DATE, expectedEmail: EMPLOYEE_EMAIL, 
                                    expectedPhoneNumber: EMPLOYEE_PHONE_NUMBER, expectedDepartmentId: departmentId.toString() }); 

    employeeId = response.body.id; 
  });

  it("should return 400 when surname/first name too big", async () => {
    const addEmployeeRequest: EmployeeRequest = { surname : EMPLOYEE_SURNAME_OVERSIZED, firstName: EMPLOYEE_FIRST_NAME_OVERSIZED }
    const response = await postEmployeeAsync(addEmployeeRequest);
    expectError(response, 'Surname must be at most 25 characters long', 400);
    expectError(response, 'First name must be at most 25 characters long', 400);
  });

  it("should return 400 when surname/first name not entered", async () => {
    const addEmployeeRequest: EmployeeRequest = { surname: "", firstName: "" }
    const response = await postEmployeeAsync(addEmployeeRequest);
    expectError(response, 'Surname is required', 400);
    expectError(response, 'First name is required', 400);
  });

  it("should return 400 when email invalid", async () => {
    const addEmployeeRequest: EmployeeRequest = { surname: EMPLOYEE_SURNAME, firstName: EMPLOYEE_FIRST_NAME, email: EMPLOYEE_INVALID_EMAIL }
    const response = await postEmployeeAsync(addEmployeeRequest); 
    expectError(response, 'Invalid email format', 400);
  });

  it("should return 400 when email too long", async () => {
    const addEmployeeRequest: EmployeeRequest = { surname: EMPLOYEE_SURNAME, firstName: EMPLOYEE_FIRST_NAME, email: EMPLOYEE_INVALID_EMAIL_TOO_LONG }
    const response = await postEmployeeAsync(addEmployeeRequest); 
    expectError(response, 'Invalid email format', 400);
  });

  it("should return 400 when phone number too long", async () => {
    const addEmployeeRequest: EmployeeRequest = { surname: EMPLOYEE_SURNAME, firstName: EMPLOYEE_FIRST_NAME, phoneNumber: EMPLOYEE_INVALID_PHONE_NUMBER}
    const response = await postEmployeeAsync(addEmployeeRequest); 
    expectError(response, 'Phone number must be less than or equal to 25 characters', 400); 
  });

  it("should return 400 when department id is not a valid id", async () => {
    const addEmployeeRequest: EmployeeRequest = { surname: EMPLOYEE_SURNAME, firstName: EMPLOYEE_FIRST_NAME, departmentId: EMPLOYEE_INVALID_DEPARTMENT_ID}
    const response = await postEmployeeAsync(addEmployeeRequest); 
    expectError(response, 'Invalid department Id', 400); 
  });

  it("should return 400 when department id not found", async () => {
    const addEmployeeRequest: EmployeeRequest = { surname: EMPLOYEE_SURNAME, firstName: EMPLOYEE_FIRST_NAME, departmentId: EMPLOYEE_NOT_FOUND_DEPARTMENT_ID}
    const response = await postEmployeeAsync(addEmployeeRequest); 
    expectError(response, 'Department not found', 404); 
  });  
});
  
describe("DELETE /api/v1/employees", () => {
 
   it("should return 200 and message when deleted", async () => {   
    const res = await deleteEmployeeAsync(employeeId);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch('Employee deleted');
  });
});
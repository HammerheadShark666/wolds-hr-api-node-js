// import { EmployeeRequest } from '../../interface/employee';
// import { expectError } from '../../utils/error.helper';
// import { expectEmployee } from './helpers/expected.helper';
// import { deleteEmployeeAsync, postEmployeeAsync } from './helpers/request.helper';
// import { getDepartmentByNameAsync } from '../department/helpers/request.helper';
// import { EMPLOYEE_TEST } from './helpers/constants';

// let employeeId = '';

// const EMPLOYEE_SURNAME_OVERSIZED = "OversizedSurnameOversizedSurnameOversizedSurname";
// const EMPLOYEE_FIRST_NAME_OVERSIZED = "OversizedFirstNameOversizedFirstNameOversizedFirstName";
// const EMPLOYEE_INVALID_EMAIL = "testhotmail";
// const EMPLOYEE_INVALID_EMAIL_TOO_LONG = "testhotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmailtesthotmail";
// const EMPLOYEE_INVALID_PHONE_NUMBER = "0177563423545623545365645645645";
// const EMPLOYEE_INVALID_DEPARTMENT_ID = "687783fbb6fc23ad4cd";
// const EMPLOYEE_NOT_FOUND_DEPARTMENT_ID = "687783fbb6fc23ad4cdca64f";

// describe("POST /api/v1/employees", () => {

//   it("should return 200 when added successfully", async () => {
 
//     const departmentId = await getDepartmentByNameAsync(EMPLOYEE_TEST.DEPARTMENT_NAME_MARKETING); 
     
//     const response = await postEmployeeAsync({
//       surname: EMPLOYEE_TEST.EMPLOYEE_SURNAME,
//       firstName: EMPLOYEE_TEST.EMPLOYEE_FIRST_NAME,
//       dateOfBirth: EMPLOYEE_TEST.EMPLOYEE_DOB,
//       hireDate: EMPLOYEE_TEST.EMPLOYEE_HIRE_DATE,
//       email: EMPLOYEE_TEST.EMPLOYEE_EMAIL,
//       phoneNumber: EMPLOYEE_TEST.EMPLOYEE_PHONE_NUMBER,
//       departmentId:departmentId.toString()
//     } satisfies EmployeeRequest);
  
//     expectEmployee(response.body, { expectedSurname: EMPLOYEE_TEST.EMPLOYEE_SURNAME, expectedFirstName: EMPLOYEE_TEST.EMPLOYEE_FIRST_NAME, expectedDateOfBirth: EMPLOYEE_TEST.EMPLOYEE_DOB, 
//                                     expectedHireDate: EMPLOYEE_TEST.EMPLOYEE_HIRE_DATE, expectedEmail: EMPLOYEE_TEST.EMPLOYEE_EMAIL, 
//                                     expectedPhoneNumber: EMPLOYEE_TEST.EMPLOYEE_PHONE_NUMBER, expectedDepartmentId: departmentId.toString() }); 

//     employeeId = response.body.id; 
//   });

//   it("should return 400 when surname/first name too big", async () => {
//     const addEmployeeRequest: EmployeeRequest = { surname : EMPLOYEE_SURNAME_OVERSIZED, firstName: EMPLOYEE_FIRST_NAME_OVERSIZED }
//     const response = await postEmployeeAsync(addEmployeeRequest);
//     expectError(response, 'Surname must be at most 25 characters long', 400);
//     expectError(response, 'First name must be at most 25 characters long', 400);
//   });

//   it("should return 400 when surname/first name not entered", async () => {
//     const addEmployeeRequest: EmployeeRequest = { surname: "", firstName: "" }
//     const response = await postEmployeeAsync(addEmployeeRequest);
//     expectError(response, 'Surname is required', 400);
//     expectError(response, 'First name is required', 400);
//   });

//   it("should return 400 when email invalid", async () => {
//     const addEmployeeRequest: EmployeeRequest = { surname: EMPLOYEE_TEST.EMPLOYEE_SURNAME, firstName: EMPLOYEE_TEST.EMPLOYEE_FIRST_NAME, email: EMPLOYEE_INVALID_EMAIL }
//     const response = await postEmployeeAsync(addEmployeeRequest); 
//     expectError(response, 'Invalid email format', 400);
//   });

//   it("should return 400 when email too long", async () => {
//     const addEmployeeRequest: EmployeeRequest = { surname: EMPLOYEE_TEST.EMPLOYEE_SURNAME, firstName: EMPLOYEE_TEST.EMPLOYEE_FIRST_NAME, email: EMPLOYEE_INVALID_EMAIL_TOO_LONG }
//     const response = await postEmployeeAsync(addEmployeeRequest); 
//     expectError(response, 'Invalid email format', 400);
//   });

//   it("should return 400 when phone number too long", async () => {
//     const addEmployeeRequest: EmployeeRequest = { surname: EMPLOYEE_TEST.EMPLOYEE_SURNAME, firstName: EMPLOYEE_TEST.EMPLOYEE_FIRST_NAME, phoneNumber: EMPLOYEE_INVALID_PHONE_NUMBER}
//     const response = await postEmployeeAsync(addEmployeeRequest); 
//     expectError(response, 'Phone number must be less than or equal to 25 characters', 400); 
//   });

//   it("should return 400 when department id is not a valid id", async () => {
//     const addEmployeeRequest: EmployeeRequest = { surname: EMPLOYEE_TEST.EMPLOYEE_SURNAME, firstName: EMPLOYEE_TEST.EMPLOYEE_FIRST_NAME, departmentId: EMPLOYEE_INVALID_DEPARTMENT_ID}
//     const response = await postEmployeeAsync(addEmployeeRequest); 
 
//     expectError(response, 'Invalid department Id', 400); 
//   });

//   it("should return 400 when department id not found", async () => {
//     const addEmployeeRequest: EmployeeRequest = { surname: EMPLOYEE_TEST.EMPLOYEE_SURNAME, firstName: EMPLOYEE_TEST.EMPLOYEE_FIRST_NAME, departmentId: EMPLOYEE_NOT_FOUND_DEPARTMENT_ID}
//     const response = await postEmployeeAsync(addEmployeeRequest); 
//     expectError(response, 'Department not found', 404); 
//   });  
// });
  
// describe("DELETE /api/v1/employees", () => {
 
//    it("should return 200 and message when deleted", async () => {   
//     const res = await deleteEmployeeAsync(employeeId);
//     expect(res.status).toBe(200);
//     expect(res.body.message).toMatch('Employee deleted');
//   });
// });


import { EmployeeRequest } from '../../interface/employee';
import { expectError } from '../../utils/error.helper';
import { expectEmployee } from './helpers/expected.helper';
import { deleteEmployeeAsync, postEmployeeAsync } from './helpers/request.helper';
import { getDepartmentByNameAsync } from '../department/helpers/request.helper';
import { EMPLOYEE_TEST, EMPLOYEE_TEST_DATA } from './helpers/constants';

let employeeId: string;

// const TEST_INVALIDS = {
//   surnameOversized: "OversizedSurnameOversizedSurnameOversizedSurname",
//   firstNameOversized: "OversizedFirstNameOversizedFirstNameOversizedFirstName",
//   invalidEmail: "testhotmail",
//   invalidEmailTooLong: "testhotmail".repeat(40),
//   invalidPhoneNumber: "0177563423545623545365645645645",
//   invalidDepartmentId: "687783fbb6fc23ad4cd",
//   notFoundDepartmentId: "687783fbb6fc23ad4cdca64f",
// };

// Helper to build EmployeeRequest with overrides
function makeEmployee(overrides: Partial<EmployeeRequest> = {}): EmployeeRequest {
  return {
    surname: EMPLOYEE_TEST_DATA.VALID.surname,
    firstName: EMPLOYEE_TEST_DATA.VALID.firstName,
    dateOfBirth: EMPLOYEE_TEST_DATA.VALID.dateOfBirth,
    hireDate: EMPLOYEE_TEST_DATA.VALID.hireDate,
    email: EMPLOYEE_TEST_DATA.VALID.email,
    phoneNumber: EMPLOYEE_TEST_DATA.VALID.phoneNumber,
    departmentId: undefined,
    ...overrides,
  };
}

describe("POST /api/v1/employees", () => {
  it("should return 200 when added successfully", async () => {
    const departmentId = await getDepartmentByNameAsync(EMPLOYEE_TEST.DEPARTMENT_NAME_MARKETING);
    const employeeReq = makeEmployee({ departmentId: departmentId.toString() });

    const response = await postEmployeeAsync(employeeReq);
    expectEmployee(response.body, {
      ...employeeReq,
      expectedDepartmentId: departmentId.toString(),
    });

    employeeId = response.body.id;
  });

  it("should return 400 when surname/first name too big", async () => {
    const response = await postEmployeeAsync(
      makeEmployee({ surname: EMPLOYEE_TEST_DATA.INVALID.OVERSIZED_NAME, firstName: EMPLOYEE_TEST_DATA.INVALID.OVERSIZED_NAME })
    );
    ["Surname must be at most 25 characters long", "First name must be at most 25 characters long"]
      .forEach(msg => expectError(response, msg, 400));
  });

  it("should return 400 when surname/first name missing", async () => {
    const response = await postEmployeeAsync(makeEmployee({ surname: "", firstName: "" }));
    ["Surname is required", "First name is required"].forEach(msg => expectError(response, msg, 400));
  });

  it("should return 400 when email invalid or too long", async () => {
    const invalidEmails = [EMPLOYEE_TEST_DATA.INVALID.INVALID_EMAIL, EMPLOYEE_TEST_DATA.INVALID.OVERSIZED_EMAIL];
    for (const email of invalidEmails) {
      const response = await postEmployeeAsync(makeEmployee({ email }));
      expectError(response, "Invalid email format", 400);
    }
  });

  it("should return 400 when phone number too long", async () => {
    const response = await postEmployeeAsync(makeEmployee({ phoneNumber: EMPLOYEE_TEST_DATA.INVALID.INVALID_PHONE }));
    expectError(response, "Phone number must be less than or equal to 25 characters", 400);
  });

  it("should return 400 when department id invalid or not found", async () => {
    const cases = [
      { departmentId: EMPLOYEE_TEST_DATA.INVALID.INVALID_DEPT, message: "Invalid department Id", status: 400 },
      { departmentId: EMPLOYEE_TEST_DATA.INVALID.NOT_FOUND_DEPT, message: "Department not found", status: 404 },
    ];

    for (const c of cases) {
      const response = await postEmployeeAsync(makeEmployee({ departmentId: c.departmentId }));
      expectError(response, c.message, c.status);
    }
  });
});

describe("DELETE /api/v1/employees", () => {
  it("should return 200 and message when deleted", async () => {
    const res = await deleteEmployeeAsync(employeeId);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch("Employee deleted");
  });
});
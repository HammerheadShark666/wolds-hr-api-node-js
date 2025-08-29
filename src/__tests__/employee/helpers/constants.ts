export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const EMPLOYEE_TEST = {
  // EMPLOYEE_SURNAME: "Jones",
  // EMPLOYEE_FIRST_NAME: "Mandy",
  // EMPLOYEE_DOB: "2000-05-23",
  // EMPLOYEE_HIRE_DATE: "2021-03-11",
  // EMPLOYEE_EMAIL: "test@hotmail.com",
  // EMPLOYEE_PHONE_NUMBER: "0177563423",
  DEPARTMENT_NAME_MARKETING: "Marketing",
  DEPARTMENT_NAME_QA: "QA"
}

// test/helpers/employee.constants.ts
export const EMPLOYEE_TEST_DATA = {
  VALID: {
    surname: "Jones",
    firstName: "Mandy",
    dateOfBirth: "2000-05-23",
    hireDate:  "2021-03-11",
    email:  "test@hotmail.com",
    phoneNumber: "0177563423",
  },
  INVALID: {
    OVERSIZED_NAME: "X".repeat(50),
    INVALID_EMAIL: "notanemail",
    INVALID_PHONE: "123456789012345678901234567890",
    INVALID_DEPT: "687783fbb6fc23ad4cd",
    NOT_FOUND_DEPT: "687783fbb6fc23ad4cdca64f",
    OVERSIZED_EMAIL: "X".repeat(255),
  }
};

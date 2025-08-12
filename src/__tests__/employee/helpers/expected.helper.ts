import { EmployeeResponse } from "../../../interface/employee";

export type ExpectEmployeeOptions = {
  expectedSurname?: string;
  expectedFirstName?: string;
  expectedDateOfBirth?: Date;
  expectedHireDate?: Date;
  expectedEmail?: string;
  expectedPhoneNumber?: string;
  expectedDepartmentId?: string;
};

export function expectEmployee(employee: Partial<EmployeeResponse>, options: ExpectEmployeeOptions = {}) {
  expect(employee).toBeDefined();
  expect(employee).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      surname: expect.any(String),
      firstName: expect.any(String),
      dateOfBirth: expect.any(String),
      hireDate: expect.any(String),
      email: expect.any(String),
      phoneNumber: employee.phoneNumber,
      photo: employee.photo,
      department: expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String)
      })
    })
  );

  if (options.expectedSurname !== undefined) {
    expect(employee.surname).toBe(options.expectedSurname);
  }

  if (options.expectedFirstName !== undefined) {
    expect(employee.firstName).toBe(options.expectedFirstName);
  }
}
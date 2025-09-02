// tests/employee/employee.test.ts
import path from "path";
import request from "supertest";
import { EmployeeRequest, EmployeeResponse } from "../../interface/employee"; 
import { withAuth } from "../utils/request.helper";
import { PAGE_SIZE } from "../../utils/constants";

// --- Constants & Test Data ---
const BASE_URL = "/v1/employees";
const EMPLOYEE_NOT_FOUND_ID = "68973949b5282483aa4f9ff8";

const EMPLOYEE_VALID: EmployeeRequest = {
  surname: "Doe",
  firstName: "John",
  dateOfBirth: "1990-01-01",
  hireDate: "2020-01-01",
  email: "john.doe@test.com",
  phoneNumber: "0123456789"
};

const EMPLOYEE_INVALID = {
  OVERSIZED_NAME: "X".repeat(50),
  INVALID_EMAIL: "notanemail",
  INVALID_PHONE: "123456789012345678901234567890",
  INVALID_DEPT: "687783fbb6fc23ad4cd"
};

// --- Helpers ---
async function employeeRequest(method: "get"|"post"|"put"|"delete", path: string, data?: EmployeeRequest | string) {  
  let req =  request(global.app!)[method](`${BASE_URL}${path}`);  
  if ((method === "post" || method === "put") && data) req = req.set("Content-Type", "application/json").send(data);
  return await withAuth(req);
}

const postEmployee = (data?: EmployeeRequest) => employeeRequest("post", "", data);
const putEmployee = (id: string, data?: EmployeeRequest) => employeeRequest("put", `/${id}`, data);
const getEmployee = (id: string) => employeeRequest("get", `/${id}`);
const deleteEmployee = (id: string) => employeeRequest("delete", `/${id}`);
const searchEmployees = (params: { keyword?: string, departmentId?: string, page?: number, pageSize?: number }) => {
  const query = new URLSearchParams({
    keyword: params.keyword || "",
    departmentId: params.departmentId || "",
    page: String(params.page || 1),
    pageSize: String(params.pageSize || PAGE_SIZE)
  });
  return employeeRequest("get", `/search?${query.toString()}`);
};
const postEmployeePhoto = (filePath: string, id: string) =>
  request(global.app!).post(`${BASE_URL}/photo/upload/${id}`)
    .set("Cookie", [global.ACCESS_TOKEN as string])
    .attach("photoFile", filePath);

function normalizeDate(value: string | undefined) {
  if (!value) return value;
  return value.split("T")[0]; // keep only YYYY-MM-DD
}

function expectEmployeeShape(
  employee: EmployeeResponse,
  overrides: Partial<EmployeeResponse | EmployeeRequest> = {}
) {
  expect({
    ...employee,
    dateOfBirth: normalizeDate(employee.dateOfBirth as any),
    hireDate: normalizeDate(employee.hireDate as any),
  }).toMatchObject({
    id: expect.any(String),
    surname: expect.any(String),
    firstName: expect.any(String),
    email: expect.any(String),
    phoneNumber: expect.any(String),
    ...overrides,
  });
}
 
function expectErrorResponse(response: any, message: string, status: number) {
  expect(response.status).toBe(status);
  const errorMessage =
    response.body.message || 
    response.body.error?.[0] ||
    response.body.errors?.[0];
  expect(errorMessage).toMatch(message);
}

// --- Test Suite ---
describe("Employee API Tests", () => {
  let employeeId = ""; 

  beforeAll(async () => {
    const response = await postEmployee(EMPLOYEE_VALID);
    employeeId = response.body.id;
  });

  afterAll(async () => {
    await deleteEmployee(employeeId);
  });

  // --- POST & Validation ---
  describe("POST /employees", () => {
    it("should create employee successfully", async () => {
      const response = await postEmployee(EMPLOYEE_VALID);
      expect(response.status).toBe(201);
      expectEmployeeShape(response.body, EMPLOYEE_VALID);
      await deleteEmployee(response.body.id);
    });

    it.each([
      ["surname", EMPLOYEE_INVALID.OVERSIZED_NAME, "Surname must be at most 25 characters long"],
      ["firstName", EMPLOYEE_INVALID.OVERSIZED_NAME, "First name must be at most 25 characters long"],
      ["email", EMPLOYEE_INVALID.INVALID_EMAIL, "Invalid email format"],
      ["phoneNumber", EMPLOYEE_INVALID.INVALID_PHONE, "Phone number must be less than or equal to 25 characters"]
    ])("should fail when %s is invalid", async (field, value, message) => {
      const invalid: any = { ...EMPLOYEE_VALID, [field]: value };
      const response = await postEmployee(invalid);
      expectErrorResponse(response, message, 400);
    });
  });

  // --- GET ---
  describe("GET /employees/:id", () => {
    it("should get employee successfully", async () => {
      const response = await getEmployee(employeeId);
      expect(response.status).toBe(200);
      expectEmployeeShape(response.body, EMPLOYEE_VALID);
    });

    it("should return 400 for invalid id", async () => {
      const response = await getEmployee("123");
      expectErrorResponse(response, "Invalid Id", 400);
    });

    it("should return 404 for not found id", async () => {
      const response = await getEmployee(EMPLOYEE_NOT_FOUND_ID);
      expectErrorResponse(response, "Employee not found", 404);
    });
  });

  // --- PUT ---
  describe("PUT /employees/:id", () => {
    it("should update employee successfully", async () => {
      const updated = { ...EMPLOYEE_VALID, surname: "Smith" };
      const response = await putEmployee(employeeId, updated);
      expect(response.status).toBe(200);
      expectEmployeeShape(response.body, updated);
    });

    it.each([
      ["surname", EMPLOYEE_INVALID.OVERSIZED_NAME, "Surname must be at most 25 characters long"],
      ["firstName", EMPLOYEE_INVALID.OVERSIZED_NAME, "First name must be at most 25 characters long"],
      ["email", EMPLOYEE_INVALID.INVALID_EMAIL, "Invalid email format"],
      ["phoneNumber", EMPLOYEE_INVALID.INVALID_PHONE, "Phone number must be less than or equal to 25 characters"]
    ])("should fail update when %s is invalid", async (field, value, message) => {
      const invalid: any = { ...EMPLOYEE_VALID, [field]: value };
      const response = await putEmployee(employeeId, invalid);
      expectErrorResponse(response, message, 400);
    });

    it("should return 404 when employee not found", async () => {
      const response = await putEmployee(EMPLOYEE_NOT_FOUND_ID, EMPLOYEE_VALID);
      expectErrorResponse(response, "Employee not found", 404);
    });
  });

  // --- DELETE ---
  describe("DELETE /employees/:id", () => {
    it("should delete employee successfully", async () => {
      const response = await postEmployee(EMPLOYEE_VALID);
      const tempId = response.body.id;
      const delRes = await deleteEmployee(tempId);
      expect(delRes.status).toBe(200);
      expect(delRes.body.message).toMatch("Employee deleted");
    });

    it("should return 400 for invalid id", async () => {
      const response = await deleteEmployee("123");
      expectErrorResponse(response, "Invalid Id", 400);
    });

    it("should return 404 for not found id", async () => {
      const response = await deleteEmployee(EMPLOYEE_NOT_FOUND_ID);
      expectErrorResponse(response, "Employee not found", 404);
    });
  });

  // --- SEARCH ---
  describe("GET /employees/search", () => {
    it("should search employees with keyword", async () => {
      const response = await searchEmployees({ keyword: "Doe", pageSize: PAGE_SIZE });
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.employees)).toBe(true);
    });

    it("should return 400 if no criteria", async () => {
      const response = await searchEmployees({ keyword: "", departmentId: "" });
      expectErrorResponse(response, "Either keyword and/or department must be provided", 400);
    });
  });

  // --- PHOTO UPLOAD ---
  describe("POST /employees/photo/upload/:id", () => {
    it("should upload employee photo successfully", async () => {
      const filePath = path.join(__dirname, "../files/Employee1.jpg");
      const response = await postEmployeePhoto(filePath, employeeId);
      expect(response.status).toBe(200);
      const [name, ext] = response.body.filename.split(".");
      expect(ext).toBe("jpg");
      expect(response.body.id).toBe(employeeId);
    });

    it("should return 404 if employee not found", async () => {
      const filePath = path.join(__dirname, "../files/Employee1.jpg");
      const response = await postEmployeePhoto(filePath, EMPLOYEE_NOT_FOUND_ID);
      expectErrorResponse(response, "Employee not found", 404);
    });
  });
});
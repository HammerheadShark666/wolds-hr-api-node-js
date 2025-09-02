import request from "supertest";
import { expectError } from "../utils/error.helper";
import { DepartmentRequest, DepartmentResponse } from "../interface/department";
import { withAuth } from "./utils/request.helper";

// --- Test Data ---
const TEST_DEPARTMENT = {
  name: "Warehouse",
  updatedName: "R&D",
  invalidId: "6877849fd6fc22ad3cdca489",
};

const testContext: { departmentId?: string } = {};
const BASE_URL = "/v1/departments";

// --- Helpers ---
type ExpectDepartmentOptions = { expectedName?: string };

function expectDepartment(
  department: DepartmentResponse,
  options: ExpectDepartmentOptions = {}
) {
  expect(department).toBeDefined();
  expect(department).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      name: expect.any(String),
    })
  );

  if (options.expectedName) {
    expect(department.name).toBe(options.expectedName);
  }
}

async function departmentRequest(method: "get"|"post"|"put"|"delete", path: string, data?: DepartmentRequest | string) {  
  let req =  request(global.app!)[method](`${BASE_URL}${path}`);
  if ((method === "post" || method === "put") && data) req = req.set("Content-Type", "application/json").send(data);
  return await withAuth(req);
}

// --- Setup & Teardown ---
beforeAll(async () => {
  const response = await departmentRequest("post", '', { name: TEST_DEPARTMENT.name });
  expect(response.status).toBe(201);
  expectDepartment(response.body, { expectedName: TEST_DEPARTMENT.name });
  testContext.departmentId = response.body.id;
});

afterAll(async () => {
  if (testContext.departmentId) { 
    await departmentRequest("delete", `/${testContext.departmentId}`);
  }
});

// --- Tests ---
describe("Departments API", () => {

  describe("GET /api/v1/departments", () => {
    it("should list departments", async () => { 
      const response =   await departmentRequest("get", ``, ``);
     
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);

      if (response.body.length > 0) {
        expectDepartment(response.body[0]);
      }
    });
  });

  describe("POST /api/v1/departments", () => {
    it("should return 400 when name is missing", async () => {
      const response = await departmentRequest("post", '', { name: '' });
      expectError(response, "Department name must be at least 2 characters", 400);
    });

    it("should return 400 when department already exists", async () => {
      const response = await departmentRequest("post", '', { name: TEST_DEPARTMENT.name });
      expectError(response, "Department name exists already", 400);
    });
  });

  describe("GET /api/v1/departments/:id", () => {
    it("should return department by ID", async () => {
      const response = await departmentRequest("get", `/${testContext.departmentId!}`);
      expect(response.status).toBe(200);
      expectDepartment(response.body, { expectedName: TEST_DEPARTMENT.name });
    });

    it("should return 404 for invalid ID", async () => {
      const response = await departmentRequest("get", `/${TEST_DEPARTMENT.invalidId}`);
      expectError(response, "Department not found", 404);
    });
  });

  describe("PUT /api/v1/departments", () => {

    it("should update department", async () => {
      const response = await departmentRequest("put", `/${testContext.departmentId!}`, { name: TEST_DEPARTMENT.updatedName }); 
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        departmentId: testContext.departmentId,
        message: "Department updated successfully",
      });
    });

    it("should return 400 for invalid department", async () => {
      const response = await departmentRequest("put", `/${TEST_DEPARTMENT.invalidId}`, { name: TEST_DEPARTMENT.name });
      expectError(response, "Department not found", 400);
    });
  });

  describe("DELETE /api/v1/departments/:id", () => {
    it("should delete department", async () => {
      const response = await departmentRequest("delete", `/${testContext.departmentId!}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch("Department deleted");

      // Prevent afterAll double-delete
      testContext.departmentId = undefined;
    });

    it("should return 404 when department not found", async () => { 
      const response = await departmentRequest("delete", `/${TEST_DEPARTMENT.invalidId}`);
      expectError(response, "Department not found", 404);
    });
  });
});
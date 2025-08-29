import { DepartmentResponse } from "../../interface/department";
import { expectError } from "../../utils/error.helper";
import {
  deleteDepartment,
  getDepartmentById,
  getDepartmentsAsync,
  putDepartment,
  postDepartment,
} from "./helpers/request.helper";

const TEST_DEPARTMENT = {
  name: "Warehouse",
  updatedName: "R&D",
  invalidId: "6877849fd6fc22ad3cdca489",
};

const testContext: { departmentId?: string } = {};

beforeAll(async () => {
  const response = await postDepartment({ name: TEST_DEPARTMENT.name });
  expectDepartment(response.body, { expectedName: TEST_DEPARTMENT.name });
  testContext.departmentId = response.body.id;
});

afterAll(async () => {
  if (testContext.departmentId) {
    await deleteDepartment(testContext.departmentId);
  }
});

describe("GET /api/v1/departments", () => {
  it("should return 200 and list departments", async () => {
    const res = await getDepartmentsAsync();
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    if (res.body.length > 0) {
      expectDepartment(res.body[0]);
    }
  });
});

describe("POST /api/v1/departments", () => {
  it("should return 400 when name is missing", async () => {
    const res = await postDepartment({ name: "" });
    expectError(res, "Department name must be at least 2 characters", 400);
  });

  it("should return 400 when department already exists", async () => {
    const res = await postDepartment({ name: TEST_DEPARTMENT.name });
    expectError(res, "Department name exists already", 400);
  });
});

describe("GET /api/v1/departments/:id", () => {
  it("should return 200 and department", async () => {
    const res = await getDepartmentById(testContext.departmentId!);
    expect(res.status).toBe(200);
    expectDepartment(res.body, { expectedName: TEST_DEPARTMENT.name });
  });

  it("should return 404 for invalid ID", async () => {
    const res = await getDepartmentById(TEST_DEPARTMENT.invalidId);
    expectError(res, "Department not found", 404);
  });
});

describe("PUT /api/v1/departments", () => {
  it("should return 200 and success message", async () => {
    const res = await putDepartment(testContext.departmentId!, TEST_DEPARTMENT.updatedName);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      departmentId: testContext.departmentId,
      message: "Department updated successfully",
    });
  });

  it("should return 400 for invalid department", async () => {
    const res = await putDepartment(TEST_DEPARTMENT.invalidId, TEST_DEPARTMENT.name);
    expectError(res, "Department not found", 400);
  });
});

describe("DELETE /api/v1/departments/:id", () => {
  it("should return 200 and message when deleted", async () => {
    const res = await deleteDepartment(testContext.departmentId!);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch("Department deleted");
    testContext.departmentId = undefined; // prevent afterAll double-delete
  });

  it("should return 404 when department not found", async () => {
    const res = await deleteDepartment(TEST_DEPARTMENT.invalidId);
    expectError(res, "Department not found", 404);
  });
});

// --- Helpers ---
type ExpectDepartmentOptions = { expectedName?: string };

function expectDepartment(department: DepartmentResponse, options: ExpectDepartmentOptions = {}) {
  expect(department).toBeDefined();
  expect(department).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      name: expect.any(String),
    })
  );

  if (options.expectedName !== undefined) {
    expect(department.name).toBe(options.expectedName);
  }
}
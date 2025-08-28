import request from 'supertest';
import { expectError } from '../../utils/error.helper';
import { deleteDepartment, getDepartmentById, getDepartmentsAsync, putDepartment, postDepartment } from './helpers/request.helper';

let departmentId = ''; 
const departmentName = 'Warehouse';
const updateDepartmentName = 'R&D';
const invalidDepartmentId = "6877849fd6fc22ad3cdca489"

beforeAll(async () => { 
  
  const response = await postDepartment({ name: departmentName });  
  expectDepartment(response.body, { expectedName: departmentName });

  departmentId = response.body.id;
});
 
describe("GET /api/v1/departments", () => {
  it("should return 200 and list departments", async () => {
    const response = await getDepartmentsAsync();
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    if (response.body.length > 0) {
      expectDepartment(response.body[0]);
    }
  });
});
 
describe("POST /api/v1/departments", () => {
  it("should return 400 when name is missing", async () => {
    const response = await postDepartment({ name: '' });
    expectError(response, 'Department name must be at least 2 characters', 400);
  });

  it("should return 400 when department already exists", async () => {
    const response = await postDepartment({ name: departmentName });
    expectError(response, 'Department name exists already', 400);
  });
});
 
describe("GET /api/v1/departments/:id", () => {
  it("should return 200 and department", async () => {
    const res = await getDepartmentById(departmentId);
    expect(res.status).toBe(200);
    expectDepartment(res.body, { expectedName: departmentName });
  });

  it("should return 404 for invalid ID", async () => {
    const res = await getDepartmentById(invalidDepartmentId);
    expectError(res, 'Department not found', 404);
  });
});
 
describe("PUT /api/v1/departments", () => {
  it("should return 200 and success message", async () => {
    const res = await putDepartment(departmentId, updateDepartmentName);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      departmentId,
      message: "Department updated successfully"
    });
  });

  it("should return 400 for invalid department", async () => {
    const res = await putDepartment(invalidDepartmentId, departmentName);
    expectError(res, 'Department not found', 400);
  });
}); 

describe("DELETE /api/v1/departments/:id", () => {
  it("should return 200 and message when deleted", async () => {
    const res = await deleteDepartment(departmentId);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch('Department deleted');
  });

  it("should return 404 when department not found", async () => {
    const res = await deleteDepartment(invalidDepartmentId);
    expectError(res, 'Department not found', 404);
  });
}); 
 
//Helpers

type Department = {
  id: string;
  name: string;
};

type ExpectDepartmentOptions = {
  expectedName?: string;
};

function expectDepartment(department: Partial<Department>, options: ExpectDepartmentOptions = {}) {
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
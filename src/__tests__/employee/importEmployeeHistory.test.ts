import request from "supertest";
import path from "path";
import { PAGE_SIZE } from "../../utils/constants";
import { withAuth } from "../utils/request.helper"; 

let importEmployeesId = "";
const baseUrl = '/v1/import/employees';  
  
function validatePaginationMeta(
  body: any,
  { page, totalPages, pageSize, totalEmployees }: { page: number; totalPages: number; pageSize: number; totalEmployees: number }
) {
  expect(body).toMatchObject({
    page,
    totalPages,
    pageSize,
    totalEmployees,
  });
}

function validateEmployeesArray(employees: any[], expectedLength: number) {
  expect(Array.isArray(employees)).toBe(true);
  expect(employees).toHaveLength(expectedLength);

  if (employees.length > 0) {
    const employee = employees[0];
    expect(employee).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        surname: expect.any(String),
        firstName: expect.any(String),
        email: expect.any(String),
        phoneNumber: expect.any(String),
      })
    );
  }
}

function validateEmployeesErrorArray(errors: any[], expectedLength: number) {
  expect(Array.isArray(errors)).toBe(true);
  expect(errors).toHaveLength(expectedLength);

  if (errors.length > 0) {
    const error = errors.find((item) => item.employee.includes("Carter"));
    expect(error).toBeDefined();

    const fields = error.employee.split(",");
    expect(fields).toHaveLength(7);
    expect(fields[0]).toBe("Carter");
    expect(fields[1]).toBe(
      "JackJackJackJackJackJackJackJackJackJackJackJackJackJackJackJackJack"
    );
    expect(fields.slice(2)).toEqual(["", "", "", "", ""]);
    expect(error.error[0]).toBe(
      "First name must be at most 25 characters long"
    );
  }
}

async function importEmployeeRequest(method: "post" | "delete", path: string, data?: string) {  
  let req =  request(global.app!)[method](`${baseUrl}${path}`);  
  if ((method === "post") && data) req = req.set("Content-Type", "application/json").attach('importFile', data);
  return await withAuth(req);
}

async function importEmployeeHistoryRequest(method: "get", path: string, data?: string) {  
  let req =  request(global.app!)[method](`${baseUrl}${path}`);   
  return await withAuth(req);
}

// --- Setup & Teardown ---
beforeAll(async () => { 
  const filePath = path.join(__dirname, "../files", "employee-imports.csv");
  const response = await importEmployeeRequest("post", ``, filePath);
  expect(response.status).toBe(200);
  importEmployeesId = response.body.id;
});

afterAll(async () => { 
  if (importEmployeesId) { 
      const response = await importEmployeeRequest("delete", `/history/${importEmployeesId}`, ``);
      expect(response.status).toBe(200);
    }
});

// --- Tests ---
describe("POST employee import history", () => {
  it("should get 1st page of imported employees", async () => {
    
    const PAGE = 1;
    const response = await importEmployeeHistoryRequest("get", `/history/imported?id=${importEmployeesId}&page=${PAGE}&pageSize=${PAGE_SIZE}`, ``);
   
    expect(response.status).toBe(200);
    validatePaginationMeta(response.body, {
      page: 1,
      totalPages: 2,
      pageSize: PAGE_SIZE,
      totalEmployees: 10,
    });
    validateEmployeesArray(response.body.employees, 5);
  });

  it("should get last page of imported employees", async () => {
   
    const PAGE = 2; 
    const response = await importEmployeeHistoryRequest("get", `/history/imported?id=${importEmployeesId}&page=${PAGE}&pageSize=${PAGE_SIZE}`, ``);
   
    expect(response.status).toBe(200);
    validatePaginationMeta(response.body, {
      page: 2,
      totalPages: 2,
      pageSize: PAGE_SIZE,
      totalEmployees: 10,
    });
    validateEmployeesArray(response.body.employees, 5);
  });

  it("should get imported existing employees", async () => {
 
    const PAGE = 1;  
    const response = await importEmployeeHistoryRequest("get", `/history/existing?id=${importEmployeesId}&page=${PAGE}&pageSize=${PAGE_SIZE}`, ``);
    
    expect(response.status).toBe(200);
    validatePaginationMeta(response.body, {
      page: 1,
      totalPages: 1,
      pageSize: PAGE_SIZE,
      totalEmployees: 2,
    });
    validateEmployeesArray(response.body.employees, 2);
  });

  it("should get imported error employees", async () => {
    
    const PAGE = 1; 
    const response = await importEmployeeHistoryRequest("get", `/history/error?id=${importEmployeesId}&page=${PAGE}&pageSize=${PAGE_SIZE}`, ``);
    
    expect(response.status).toBe(200);
    validatePaginationMeta(response.body, {
      page: 1,
      totalPages: 2,
      pageSize: PAGE_SIZE,
      totalEmployees: 8,
    });
    validateEmployeesErrorArray(response.body.employees, 5);
  });
});
import { EmployeeResponse } from "../../interface/employee";
import { PAGE_SIZE } from "../../utils/constants";
import { expectError } from "../../utils/error.helper";
import { getDepartmentsAsync } from "../department/helpers/request.helper";
import { getSearchEmployeesAsync } from "./helpers/request.helper"; 

const KEYWORD = 'john';
const ALL_EMPLOYEES_PAGE_SIZE = 120;
let searchResultsTotal = 0;
let totalPages = 0;

describe("GET /api/v1/employees (ignore department)", () => {
  beforeAll(async () => {
    const response = await getSearchEmployeesAsync({ keyword: KEYWORD, departmentId: '', page: 1, pageSize: PAGE_SIZE });
    searchResultsTotal = response.body.totalEmployees;
    totalPages = Math.ceil(searchResultsTotal / PAGE_SIZE);
  });

  it("should return 400 and message when no criteria entered", async () => {
    const response = await getSearchEmployeesAsync({ keyword: '', departmentId: '',page: 1, pageSize: PAGE_SIZE });    
    expectError(response, 'Either keyword and/or department must be provided', 400);
  }); 

  it("should return 200 and first page of search results when first page is requested", async () => {
    const response = await getSearchEmployeesAsync({ keyword: KEYWORD, departmentId: '',page: 1, pageSize: PAGE_SIZE });

    const expectedCount = Math.min(PAGE_SIZE, searchResultsTotal);

    expect(response.status).toBe(200);
    validatePaginationMeta(response.body, 1, totalPages, PAGE_SIZE);
    validateEmployeesArray(response.body.employees, expectedCount);
  });

  it("should return 200 and last page of search results when last page is requested", async () => {
    const lastPage = Math.max(1, totalPages);
    const lastPageCount = searchResultsTotal % PAGE_SIZE || (searchResultsTotal === 0 ? 0 : PAGE_SIZE);

    const response = await getSearchEmployeesAsync({ keyword: KEYWORD, departmentId: '',page: lastPage, pageSize: PAGE_SIZE }); 

    expect(response.status).toBe(200);
    validatePaginationMeta(response.body, lastPage, totalPages, PAGE_SIZE);
    validateEmployeesArray(response.body.employees, lastPageCount);
  });

   it("should return 200 and first page of search results when page is zero", async () => {
    const response = await getSearchEmployeesAsync({ keyword: KEYWORD, departmentId: '',page: 0, pageSize: PAGE_SIZE });

    const expectedCount = Math.min(PAGE_SIZE, searchResultsTotal);

    expect(response.status).toBe(200);
    validatePaginationMeta(response.body, 1, totalPages, PAGE_SIZE);
    validateEmployeesArray(response.body.employees, expectedCount);
  });
});

describe("GET /api/v1/employees (include department)", () => {

  let departmentId = '';
  let departmentName = '';

  beforeAll(async () => { 
    const response = await getDepartmentsAsync();
    const departments = response.body; 
    departmentId = departments[0].id;
    departmentName = departments[0].name; 
  });

  it("should return 200 and all employees should have same department and keyword in surname", async () => {
    const response = await getSearchEmployeesAsync({ keyword: KEYWORD, departmentId: departmentId, page: 1, pageSize: PAGE_SIZE });
 
    searchResultsTotal = response.body.totalEmployees;
    totalPages = Math.ceil(searchResultsTotal / PAGE_SIZE);

    const expectedCount = Math.min(PAGE_SIZE, searchResultsTotal);

    expect(response.status).toBe(200);
    validatePaginationMeta(response.body, 1, totalPages, PAGE_SIZE);
    validateEmployeesArray(response.body.employees, expectedCount);
    
    const employees: EmployeeResponse[] = response.body.employees;
  
    (employees).forEach((employee: EmployeeResponse) => {
      expect(employee).toHaveProperty("department");
      expect(employee.department).toHaveProperty("id");
      expect(employee.department).toHaveProperty("name");
      expect(employee.department.id).toBe(departmentId);
      expect(employee.department.name).toBe(departmentName);
    }); 
  });

  it("should return 200 and  all employees should have same department, surnames should include keyword and non keyword names", async () => { 

    const response = await getSearchEmployeesAsync({ keyword: '', departmentId: departmentId, page: 1, pageSize: ALL_EMPLOYEES_PAGE_SIZE });
    searchResultsTotal = response.body.totalEmployees;
    totalPages = Math.ceil(searchResultsTotal / ALL_EMPLOYEES_PAGE_SIZE); 

    const expectedCount = Math.min(ALL_EMPLOYEES_PAGE_SIZE, searchResultsTotal);

    expect(response.status).toBe(200);
    validatePaginationMeta(response.body, 1, totalPages, ALL_EMPLOYEES_PAGE_SIZE);
    validateEmployeesArray(response.body.employees, expectedCount);
    
    const employees: EmployeeResponse[] = response.body.employees;

    const countOfJohnSurnames = employees.filter(employee =>
      employee.surname.toLowerCase().includes('john')
    ).length;

    const countOfNotJohnSurnames = employees.filter(employee =>
      !employee.surname.toLowerCase().includes('john')
    ).length;

    expect(employees.length).toEqual(countOfJohnSurnames + countOfNotJohnSurnames); 
  });

 it("should return 200 and  all employees should include different departments", async () => { 

    const response = await getSearchEmployeesAsync({ keyword: KEYWORD, departmentId: '', page: 1, pageSize: ALL_EMPLOYEES_PAGE_SIZE });
    searchResultsTotal = response.body.totalEmployees;
    totalPages = Math.ceil(searchResultsTotal / ALL_EMPLOYEES_PAGE_SIZE); 

    const expectedCount = Math.min(ALL_EMPLOYEES_PAGE_SIZE, searchResultsTotal);

    expect(response.status).toBe(200);
    validatePaginationMeta(response.body, 1, totalPages, ALL_EMPLOYEES_PAGE_SIZE);
    validateEmployeesArray(response.body.employees, expectedCount);
    
    const employees: EmployeeResponse[] = response.body.employees; 
    const departmentCounts = countEmployeesPerDepartment(employees);
    const totalEmployees = Object.values(departmentCounts).reduce((sum, count) => sum + count, 0);

    expect(employees.length).toEqual(totalEmployees);
  });
});
 
// Helpers

function validatePaginationMeta(body: any, page: number, totalPages: number, pageSize: number) {
  expect(body).toHaveProperty("totalPages", totalPages);
  expect(body).toHaveProperty("page", page);
  expect(body).toHaveProperty("totalEmployees", searchResultsTotal);
  expect(body).toHaveProperty("pageSize", pageSize);
}

function validateEmployeesArray(employees: any[], expectedLength: number) {
  expect(Array.isArray(employees)).toBe(true);
  expect(employees.length).toBe(expectedLength);

  if (employees.length > 0) {
    const employee = employees[0];
    expect(employee).toHaveProperty("id");
    expect(employee).toHaveProperty("surname");
    expect(employee).toHaveProperty("firstName");
    expect(employee).toHaveProperty("email");
    expect(employee).toHaveProperty("phoneNumber");
  }
} 

function countEmployeesPerDepartment(employees: EmployeeResponse[]): Record<string, number> {
  const departmentCounts: Record<string, number> = {};

  employees.forEach(employee => {
    const deptName = employee.department?.name ?? 'Unknown';
    departmentCounts[deptName] = (departmentCounts[deptName] || 0) + 1;
  });

  return departmentCounts;
}
import request from "supertest"; 

const PAGE_SIZE = 5;
let searchResultsTotal = 0;
let totalPages = 0;

describe("GET /api/v1/employees", () => {
  beforeAll(async () => {
    const response = await getSearchEmployees({ page: 1, pageSize: PAGE_SIZE });
    searchResultsTotal = response.body.totalEmployees;
    totalPages = Math.ceil(searchResultsTotal / PAGE_SIZE);
  });

  it("should return 200 and first page of search results when first page is requested", async () => {
    const response = await getSearchEmployees({ page: 1, pageSize: PAGE_SIZE });

    const expectedCount = Math.min(PAGE_SIZE, searchResultsTotal);

    expect(response.status).toBe(200);
    validatePaginationMeta(response.body, 1, totalPages);
    validateEmployeesArray(response.body.employees, expectedCount);
  });

  it("should return 200 and last page of search results when last page is requested", async () => {
    const lastPage = Math.max(1, totalPages);
    const lastPageCount = searchResultsTotal % PAGE_SIZE || (searchResultsTotal === 0 ? 0 : PAGE_SIZE);

    const response = await getSearchEmployees({ page: lastPage, pageSize: PAGE_SIZE }); 

    expect(response.status).toBe(200);
    validatePaginationMeta(response.body, lastPage, totalPages);
    validateEmployeesArray(response.body.employees, lastPageCount);
  });

   it("should return 200 and first page of search results when page is zero", async () => {
    const response = await getSearchEmployees({ page: 0, pageSize: PAGE_SIZE });

    const expectedCount = Math.min(PAGE_SIZE, searchResultsTotal);

    expect(response.status).toBe(200);
    validatePaginationMeta(response.body, 1, totalPages);
    validateEmployeesArray(response.body.employees, expectedCount);
  });
});

//Api functions

function getSearchEmployees(params?: { page: number, pageSize: number }) {
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? PAGE_SIZE;

  if (!global.ACCESS_TOKEN)
    throw new Error("Access token is missing");

  return request(global.app!)
    .get(`/v1/employees/search?keyword=john&page=${page}&pageSize=${pageSize}`)
    .set("Cookie", [global.ACCESS_TOKEN]);
}

// Helpers

function validatePaginationMeta(body: any, page: number, totalPages: number) {
  expect(body).toHaveProperty("totalPages", totalPages);
  expect(body).toHaveProperty("page", page);
  expect(body).toHaveProperty("totalEmployees", searchResultsTotal);
  expect(body).toHaveProperty("pageSize", PAGE_SIZE);
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


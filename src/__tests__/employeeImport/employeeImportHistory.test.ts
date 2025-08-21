import path from "path";
import { deleteImportedEmployees, getEmployeeImportHistoryAsync, postImportEmployeeAsync } from "./helpers/request.helper";
import { PAGE_SIZE } from "../../utils/constants";
  
let importedEmpoyeesTotal = 8;
let totalPages = 2;
let employeeImportId: string; 

beforeAll(async () => { 
  const filePath = path.join(__dirname, '../files', 'employee-imports.csv');
  
  if(global.ACCESS_TOKEN == null)
    throw new Error("Access token is missing"); 

  const response = await postImportEmployeeAsync(filePath); 
  expect(response.status).toBe(200);   

  employeeImportId = response.body.id; 
});

afterAll(async () => {  
  const res = await deleteImportedEmployees(employeeImportId);
  expect(res.status).toBe(200);
}); 

describe('POST employee import history', () => {
  
  it('should get 1st page of imported employees successfully', async () => {
 
    if(global.ACCESS_TOKEN == null)
      throw new Error("Access token is missing");   
   
    const response = await getEmployeeImportHistoryAsync({ employeeImportId, page: 1, pageSize: PAGE_SIZE}); 

    console.log(response.body)

    expect(response.status).toBe(200);    
    validatePaginationMeta(response.body, 1, totalPages, PAGE_SIZE);
    validateEmployeesArray(response.body.employees, 5);  
  });

  // it('should get last page of imported employees successfully', async () => {
 
  //   if(global.ACCESS_TOKEN == null)
  //     throw new Error("Access token is missing"); 

  //   const employeeImportId = new Types.ObjectId('68a5972f51011f6306e65b30');
  
  //   const response = await getEmployeeImportHistoryAsync({employeeImportId, page: 2, pageSize: PAGE_SIZE}); 
  //   expect(response.status).toBe(200);    
  //   validatePaginationMeta(response.body, 2, totalPages, PAGE_SIZE);
  //   validateEmployeesArray(response.body.employees, 3);  
  // });
 
});

function validatePaginationMeta(body: any, page: number, totalPages: number, pageSize: number) {
  expect(body).toHaveProperty("totalPages", totalPages);
  expect(body).toHaveProperty("page", page);
  expect(body).toHaveProperty("totalEmployees", importedEmpoyeesTotal);
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
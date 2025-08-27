import path from "path";
import { PAGE_SIZE } from "../../utils/constants";
import { deleteImportedEmployeesAsync, getImportedEmployeesErrorHistoryAsync, getImportedEmployeesExistingHistoryAsync, getImportedEmployeesHistoryAsync, postImportEmployeeAsync } from "./helpers/request.helper";
   
let importEmployeesId: string = ""

beforeAll(async () => { 
  const filePath = path.join(__dirname, '../files', 'employee-imports.csv');
  
  if(global.ACCESS_TOKEN == null)
    throw new Error("Access token is missing"); 

  const response = await postImportEmployeeAsync(filePath); 
  expect(response.status).toBe(200);   

  importEmployeesId = response.body.id;
});

afterAll(async () => {
  let res = await deleteImportedEmployeesAsync(importEmployeesId);
  expect(res.status).toBe(200);  
}); 

describe('POST employee import history', () => {
  
  it('should get 1st page of imported employees successfully', async () => {
 
    if(global.ACCESS_TOKEN == null)
      throw new Error("Access token is missing");   
   
    const response = await getImportedEmployeesHistoryAsync({ importEmployeesId, page: 1, pageSize: PAGE_SIZE}); 
 
    let expectedEmployeesTotal = 10;
    let expectedEmployeesInPage = 5;
    let expectedTotalPages = 2;

    expect(response.status).toBe(200);    
    validatePaginationMeta(response.body, 1, expectedTotalPages, PAGE_SIZE, expectedEmployeesTotal);
    validateEmployeesArray(response.body.employees, expectedEmployeesInPage);  
  });

  it('should get last page of imported employees successfully', async () => {
 
    if(global.ACCESS_TOKEN == null)
      throw new Error("Access token is missing");  
  
    const response = await getImportedEmployeesHistoryAsync({importEmployeesId, page: 2, pageSize: PAGE_SIZE}); 

    let expectedEmployeesTotal = 10;
    let expectedEmployeesInPage = 5;
    let expectedTotalPages = 2;

    expect(response.status).toBe(200);    
    validatePaginationMeta(response.body, 2, expectedTotalPages, PAGE_SIZE, expectedEmployeesTotal);
    validateEmployeesArray(response.body.employees, expectedEmployeesInPage);  
  });

  it('should get 1st page of imported existing employees successfully', async () => {
 
    if(global.ACCESS_TOKEN == null)
      throw new Error("Access token is missing");   
   
    const response = await getImportedEmployeesExistingHistoryAsync({ importEmployeesId, page: 1, pageSize: PAGE_SIZE}); 
 
    let expectedEmployeesTotal = 2;
    let expectedEmployeesInPage = 2;
    let expectedTotalPages = 1;
 
    expect(response.status).toBe(200);    
    validatePaginationMeta(response.body, 1, expectedTotalPages, PAGE_SIZE, expectedEmployeesTotal);
    validateEmployeesArray(response.body.employees, expectedEmployeesInPage);  
  });

  it('should get 1st page of imported error employees successfully', async () => {
 
    if(global.ACCESS_TOKEN == null)
      throw new Error("Access token is missing");   
   
    const response = await getImportedEmployeesErrorHistoryAsync({ importEmployeesId, page: 1, pageSize: PAGE_SIZE}); 
 
    let expectedEmployeesTotal = 7;
    let expectedEmployeesInPage = 5;
    let expectedTotalPages = 2;  
 
    expect(response.status).toBe(200);    
    validatePaginationMeta(response.body, 1, expectedTotalPages, PAGE_SIZE, expectedEmployeesTotal);
    validateEmployeesErrorArray(response.body.employees, expectedEmployeesInPage);  
  });
 
});

function validatePaginationMeta(body: any, page: number, totalPages: number, pageSize: number, totalEmloyees: number) {
  expect(body).toHaveProperty("totalPages", totalPages);
  expect(body).toHaveProperty("page", page);
  expect(body).toHaveProperty("totalEmployees", totalEmloyees);
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

function validateEmployeesErrorArray(errors: any[], expectedLength: number) {
  expect(Array.isArray(errors)).toBe(true);
  expect(errors.length).toBe(expectedLength);
 
  if (errors.length > 0) { 

    const error = errors.find(item => item.employee.includes("Pruitt"));    
    const fields = error.employee.split(',');

    expect(fields).toHaveLength(7);
    expect(fields[0]).toBe('Pruitt');                           
    expect(fields[1]).toBe('Matthew');                          
    expect(fields[2]).toBe('1974-12-08');                      
    expect(fields[3]).toBe('2011-01-15');                        
    expect(fields[4]).toBe('68a5e82bee6dd9293bf8aad6'); 
    expect(fields[5]).toBe('moranjason@gmail.com');           
    expect(fields[6]).toBe('07814016865');
  }
} 
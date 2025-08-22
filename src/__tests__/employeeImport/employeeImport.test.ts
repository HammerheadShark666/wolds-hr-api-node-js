import path from "path"; 
import {  deleteImportedEmployeesAsync, postImportEmployeeAsync } from "./helpers/request.helper";   

let employeeImportId: string = ""

afterAll(async () => {
  const res = await deleteImportedEmployeesAsync(employeeImportId);
  expect(res.status).toBe(200);   
}); 

describe('Import employees from file', () => {
   
  it('should import employees successfully', async () => {
  
    const filePath = path.join(__dirname, '../files', 'employee-imports.csv');

    if(global.ACCESS_TOKEN == null)
      throw new Error("Access token is missing"); 
 
    const response = await postImportEmployeeAsync(filePath); 
    expect(response.status).toBe(200);   
 
    employeeImportId = response.body.id; 
  });



  // it('should return 404 if employee not found', async () => {

  //   const filePath = path.join(__dirname, '../files', 'Employee1.jpg');

  //   if(global.ACCESS_TOKEN == null)
  //     throw new Error("Access token is missing"); 

  //   const response = await request(global.app!)
  //     .post(`/v1/employees/photo/upload/${EMPLOYEE_NOT_FOUND_ID}`)
  //       .set("Cookie", [global.ACCESS_TOKEN])
  //       .attach('photoFile', filePath);

  //   expectError(response, 'Employee not found', 404);
  // }); 
});
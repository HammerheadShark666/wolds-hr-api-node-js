import path from "path"; 
import { deleteImportedEmployees, postImportEmployeeAsync } from "./helpers/request.helper";   
import { ImportedExistingEmployeeModel } from "../../models/importedExistingEmployee..model";
import { ImportedEmployeeErrorModel } from "../../models/importedEmployeeError.model";
import request from 'supertest';
import { AUTHENTICATION_ERRORS } from "../../utils/constants";
import { Types } from "mongoose"; 

afterAll(async () => {   
  const res = await deleteImportedEmployees(global.employeeImportId);
  expect(res.status).toBe(200);
}); 

describe('Import employees from file', () => {
   
  it('should import employees successfully', async () => {
  
    const filePath = path.join(__dirname, '../files', 'employee-imports.csv');

    if(global.ACCESS_TOKEN == null)
      throw new Error("Access token is missing"); 
 
    const response = await postImportEmployeeAsync(filePath); 
    expect(response.status).toBe(200);   
 
    global.employeeImportId = response.body.id; 
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


// async function deleteImportedEmployees(employeeImportId: Types.ObjectId) {
//   if(global.ACCESS_TOKEN == null)
//     throw new Error(AUTHENTICATION_ERRORS.ACCESS_TOKEN_MISSING);

//   const req = request(global.app!)
//     .delete(`/v1/employees/import/history/imported/${employeeImportId}`)            
//       .set("Cookie", [global.ACCESS_TOKEN])
//       .set("Content-Type", "application/json");
    
//   return req.send();
// }

async function deleteImportExistingEmployees(employeeImportId: Types.ObjectId) {
  const result = await ImportedExistingEmployeeModel.deleteMany({ employeeImportId });  
  console.log(`Deleted ${result.deletedCount} import existing employees.`);
}

async function deleteImportEmployeesError(employeeImportId: Types.ObjectId) {
  const result = await ImportedEmployeeErrorModel.deleteMany({ employeeImportId });  
  console.log(`Deleted ${result.deletedCount} import error employees.`);
}

//delete employeeImported
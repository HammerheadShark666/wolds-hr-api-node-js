import path from "path"; 
import { postImportEmployeeAsync } from "./helpers/request.helper"; 
import mongoose, { Types } from "mongoose";
import { EmployeeModel } from "../../models/employee.model";
import { ImportedExistingEmployeeModel } from "../../models/importedExistingEmployee..model";
import { ImportedEmployeeErrorModel } from "../../models/importedEmployeeError.model";

afterAll(async () => {  

  console.log("global.employeeImportId = ", global.employeeImportId);
  //await deleteImportedEmployees(global.employeeImportId);
//  await deleteImportExistingEmployees(global.employeeImportId);
//  await deleteImportEmployeesError(employeeImportId); 
}, 20000);

describe('Import employees from file', () => {
  
  it('should import employees successfully', async () => {

    const filePath = path.join(__dirname, '../files', 'employee-imports.csv');

    if(global.ACCESS_TOKEN == null)
      throw new Error("Access token is missing"); 

    console.log("should import employees successfully")
  
    const response = await postImportEmployeeAsync(filePath); 
    expect(response.status).toBe(200);  
    
    console.log("response.body.id = ", response.body.id)

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


async function deleteImportedEmployees(employeeImportId: Types.ObjectId) {


  //  if (!mongoose.connection.readyState) {
  //   throw new Error("Database not connected");
  // }

  console.log("Connection readyState:", mongoose.connection.readyState); 

  console.log("Deleting imported employees");

  console.log("employeeImportId:", employeeImportId);
console.log("Is ObjectId?", Types.ObjectId.isValid(employeeImportId));

 NO CONNECTION


  const result = await mongoose.connection.collection('employees').deleteMany({ employeeImportId: employeeImportId });

  //const result = await mongoose.connection.collection("employees").deleteOne({ employeeImportId });

  console.log("Deleted count:", result.deletedCount);

  console.log("Deleting imported employees");
//  const result = await EmployeeModel.deleteMany({ employeeImportId }).exec();
//  console.log(`Deleted ${result.deletedCount} imported employees.`);
}

async function deleteImportExistingEmployees(employeeImportId: Types.ObjectId) {
  const result = await ImportedExistingEmployeeModel.deleteMany({ employeeImportId });  
  console.log(`Deleted ${result.deletedCount} import existing employees.`);
}

async function deleteImportEmployeesError(employeeImportId: Types.ObjectId) {
  const result = await ImportedEmployeeErrorModel.deleteMany({ employeeImportId });  
  console.log(`Deleted ${result.deletedCount} import error employees.`);
}

//delete employeeImported
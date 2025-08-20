import { EmployeeImportResponse } from "../interface/employee";
import { ServiceResult } from "../types/ServiceResult";
import { handleServiceError } from "../utils/error.helper"; 
import { EmployeeModel } from "../models/employee.model";
import mongoose from "mongoose";
import { ImportedEmployeeModel } from "../models/importedEmployee.model"; 
import { EmployeeImport, ImportEmployee } from "../interface/employeeImport";
import { ImportedExistingEmployeeModel } from "../models/importedExistingEmployee..model";
import { getEndOfDayDate, getStartOfDayDate } from "../utils/date.helper";
import { parseImportEmployeeCsvBuffer } from "../utils/employeeParser.helper";
import { ImportedEmployeeErrorModel } from "../models/importedEmployeeError.model";
   
export async function importEmployees(fileBuffer: Buffer, mimeType: string): Promise<ServiceResult<EmployeeImportResponse>> {
 
  try {

    const employeeImport: EmployeeImport = await addEmployeeImport();
    if(!employeeImport)
      throw new Error("Employee import not created")

    const employees = await parseImportEmployeeCsvBuffer(fileBuffer, employeeImport.id);
  
    for (const employee of employees) {

      try {
 
        employee.employeeImportId = employeeImport.id;

        if(employee.surname == 'Pruitt')
          throw new Error('Error with imported employee');

        const employeeExists = await employeeExistsAsync(employee.surname, employee.firstName, employee.dateOfBirth);
        if(employeeExists) {    
          const importedExistingEmployee = new ImportedExistingEmployeeModel(employee);
          await importedExistingEmployee.save();        
        }
        else { 
          const employeeToImport = new EmployeeModel(employee);
          await employeeToImport.save();    
        } 
      } 
      catch (err: unknown) {
        let errorMessage = 'Unknown error';
        if (err instanceof Error) {
          errorMessage = err.message;
        }

        console.log(err) 
        const importedEmployeeError = new ImportedEmployeeErrorModel({employee: employeeToCsvLine(employee), employeeImportId: employeeImport.id, error: errorMessage});
        await importedEmployeeError.save();   
      }
    }; 

    console.log("a")

    const result = await mongoose.connection.collection("employees").deleteOne({ employeeImport: employeeImport.id });
  
    console.log("b")

    return { success: true, data: {id: employeeImport.id, date: new Date()}}; 
  } 
  catch (err: unknown) {  
    console.log(err)
    return handleServiceError(err); 
  } 
}

async function addEmployeeImport() {
  const importedEmployee = new ImportedEmployeeModel();
  importedEmployee._id = new mongoose.Types.ObjectId();
  const saved = await importedEmployee.save();   
  return { id: saved._id, date: saved.date, employees: [], existingEmployees: [] };
} 

async function employeeExistsAsync(surname: string, firstName: string, dateOfBirth: Date | null) : Promise<boolean> {

  const query: any = {
    surname: surname,
    firstName: firstName,
  };

  if (dateOfBirth) {   
    query.dateOfBirth = { $gte: getStartOfDayDate(dateOfBirth), $lte: getEndOfDayDate(dateOfBirth) };
  }

  const exists = await EmployeeModel.findOne(query);
  return exists !== null;  
} 

function employeeToCsvLine(employee: ImportEmployee): string {
  const fields = [
    employee.surname ?? "",
    employee.firstName ?? "",
    employee.dateOfBirth ? employee.dateOfBirth.toISOString().split("T")[0] : "",
    employee.hireDate ? employee.hireDate.toISOString().split("T")[0] : "",
    employee.departmentId ? employee.departmentId.toString() : "",
    employee.email ?? "",
    employee.phoneNumber ?? ""     
  ];

  return fields.join(",");
} 
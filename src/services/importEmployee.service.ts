import { ServiceResult } from "../types/ServiceResult";
import { handleServiceError } from "../utils/error.helper"; 
import { EmployeeModel } from "../models/employee.model";
import { Types } from "mongoose";
import { ImportedEmployeeModel } from "../models/importedEmployee.model";  
import { ImportedExistingEmployeeModel } from "../models/importedExistingEmployee..model";
import { getEndOfDayDate, getStartOfDayDate } from "../utils/date.helper";
import { parseImportEmployeeCsvBuffer } from "../utils/employeeParser.helper";
import { ImportedEmployeeErrorModel } from "../models/importedEmployeeError.model";  
import { ImportedEmployees, ImportEmployee } from "../interface/importEmployee";
import { ImportedEmployeeHistory } from "../interface/employeeImportHistory";
   
export async function importEmployees(fileBuffer: Buffer, mimeType: string): Promise<ServiceResult<ImportedEmployeeHistory>> {
 
  try {

    const importedEmployees: ImportedEmployees = await addImportedEmployees();
    if(!importedEmployees)
      throw new Error("Employee import not created")

    const employees = await parseImportEmployeeCsvBuffer(fileBuffer, importedEmployees.id);
  
    for (const employee of employees) {

      try {
 
        employee.importEmployeesId = importedEmployees.id;

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
        const importedEmployeeError = new ImportedEmployeeErrorModel({employee: employeeToCsvLine(employee), importEmployeesId: importedEmployees.id, error: errorMessage});
        await importedEmployeeError.save();   
      }
    }; 
  
    return { success: true, data: {id: importedEmployees.id, date: new Date()}}; 
  } 
  catch (err: unknown) {  
    console.log(err)
    return handleServiceError(err); 
  } 
}

async function addImportedEmployees() {
  const importedEmployee = new ImportedEmployeeModel();
  importedEmployee._id = new Types.ObjectId();
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
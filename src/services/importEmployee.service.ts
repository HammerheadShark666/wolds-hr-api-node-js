import { ServiceResult } from "../types/ServiceResult";
import { handleServiceError } from "../utils/error.helper"; 
import { EmployeeModel } from "../models/employee.model";
import { Types } from "mongoose";
import { ImportedEmployeeModel } from "../models/importedEmployee.model";  
import { ImportedExistingEmployeeModel } from "../models/importedExistingEmployee..model";
import { getEndOfDayDate, getStartOfDayDate } from "../utils/date.helper";
import { parseImportEmployeeCsvBuffer } from "../utils/employeeParser.helper";
import { ImportedEmployeeErrorModel } from "../models/importedEmployeeError.model";  
import { ImportedEmployee, ImportedEmployees, ImportEmployee } from "../interface/importEmployee"; 
import { validate } from "../validation/validate";
import { importEmployeeSchema } from "../validation/importEmployee/importEmployee.schema";
import { DepartmentModel } from "../models/department.model";

function isValidDate(dateString: string | null) {
  if(!dateString) return true;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}
   
export async function importEmployees(fileBuffer: Buffer, mimeType: string): Promise<ServiceResult<ImportedEmployees>> {
 
  let importedEmployeesCount: number = 0;
  let importEmployeesExistingCount: number= 0;
  let importEmployeesErrorsCount: number= 0;

  try {

    const importedEmployees: ImportedEmployee = await addImportedEmployees();
    if(!importedEmployees)
      throw new Error("Employee import not created")

    const employees = await parseImportEmployeeCsvBuffer(fileBuffer, importedEmployees.id);
  
    for (const employee of employees) {

      try {
 
        employee.importEmployeesId = importedEmployees.id;


        const validationResult = await validate(importEmployeeSchema, employee);  
        if (!validationResult.success) {
          
          if(employee.departmentId) {
            const department = await DepartmentModel.findById(employee.departmentId);
            if(!department) {
              validationResult.error.push('Department does not exist in database');
            }
          }

          const importedEmployeeError = new ImportedEmployeeErrorModel({employee: employeeToCsvLine(employee), importEmployeesId: importedEmployees.id, error: validationResult.error});
          await importedEmployeeError.save();
          importEmployeesErrorsCount++;
        } else {

          if(employee.departmentId) {
            const department = DepartmentModel.findById(employee.departmentId);
            if(!department) {
              const importedEmployeeError = new ImportedEmployeeErrorModel({employee: employeeToCsvLine(employee), importEmployeesId: importedEmployees.id, error: ['Department does not exist in database']});
              await importedEmployeeError.save();
              importEmployeesErrorsCount++;
              continue;
            }
          } 

          if(employee.surname == 'Pruitt')
            throw new Error('Error with imported employee');

          const employeeExists = await employeeExistsAsync(employee.surname, employee.firstName, employee.dateOfBirth ? new Date(employee.dateOfBirth) : null);
          if(employeeExists) {
            const importedExistingEmployee = new ImportedExistingEmployeeModel(employee);
            await importedExistingEmployee.save(); 
            importEmployeesExistingCount++;       
          }
          else { 
            const employeeToImport = new EmployeeModel(employee);
            await employeeToImport.save();    
            importedEmployeesCount++;
          } 
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
        importEmployeesErrorsCount++;
      }
    }; 
 
    return { success: true, data: { id: importedEmployees.id, date: importedEmployees.date, importedEmployeesCount: importedEmployeesCount, importEmployeesExistingCount: importEmployeesExistingCount, importEmployeesErrorsCount: importEmployeesErrorsCount }}
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
  return { id: saved._id, date: saved.date };
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
    employee.dateOfBirth,
    employee.hireDate,
    employee.departmentId ? employee.departmentId.toString() : "",
    employee.email ?? "",
    employee.phoneNumber ?? ""     
  ];

  return fields.join(",");
} 
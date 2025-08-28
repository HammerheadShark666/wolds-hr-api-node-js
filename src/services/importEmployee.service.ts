import { ServiceResult } from "../types/ServiceResult";
import { getError, handleServiceError } from "../utils/error.helper"; 
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
import { EXPECTED_HEADERS } from "../utils/constants"; 

export async function importEmployees(fileBuffer: Buffer, mimeType: string): Promise<ServiceResult<ImportedEmployees>> {
 
  let importedEmployeesCount: number = 0;
  let importEmployeesExistingCount: number= 0;
  let importEmployeesErrorsCount: number= 0;

  try {

    validateCSVBuffer(fileBuffer);

    const importedEmployees: ImportedEmployee = await addImportedEmployees();
    if(!importedEmployees)
      throw new Error("Employee import not created")

    const employees = await parseImportEmployeeCsvBuffer(fileBuffer, importedEmployees.id);
  
    for (const employee of employees) {

      try {
 
        employee.importEmployeesId = importedEmployees.id;

        const validationResult = await validate(importEmployeeSchema, employee);  
        if (!validationResult.success) { 
          importEmployeesErrorsCount = await saveImportedEmployeeErrorAsync(employee, importedEmployees.id, importEmployeesErrorsCount, validationResult.error);
        } else { 
 
          const employeeExists = await employeeExistsAsync(employee.surname, employee.firstName, employee.dateOfBirth ? new Date(employee.dateOfBirth) : null);
          if(employeeExists) { 
            importEmployeesExistingCount = await saveImportedEmployeeExistingAsync(employee, importEmployeesExistingCount); 
          }
          else {  
            importedEmployeesCount = await saveImportedEmployeesAsync(employee, importedEmployeesCount);   
          } 
        } 
      } 
      catch (err: unknown) {
        console.log(err);  
        importEmployeesErrorsCount = await saveImportedEmployeeErrorAsync(employee, importedEmployees.id, importEmployeesErrorsCount, [getError(err)]);             
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

async function saveImportedEmployeesAsync(employee: ImportEmployee, importedEmployeesCount: number): Promise<number> {
  const employeeToImport = new EmployeeModel(employee);
  await employeeToImport.save();    
  importedEmployeesCount++;
  return importedEmployeesCount;
}

async function saveImportedEmployeeExistingAsync(employee: ImportEmployee, importEmployeesExistingCount: number): Promise<number> {
  const importedExistingEmployee = new ImportedExistingEmployeeModel(employee);
  await importedExistingEmployee.save(); 
  importEmployeesExistingCount++;
  return importEmployeesExistingCount;     
}
 
async function saveImportedEmployeeErrorAsync(employee: ImportEmployee, importedEmployeeId: Types.ObjectId, importEmployeesErrorsCount: number, error: string | string[]): Promise<number> {
  const importedEmployeeError = new ImportedEmployeeErrorModel({employee: employeeToCsvLine(employee), importEmployeesId: importedEmployeeId, error: error});
  await importedEmployeeError.save();
  importEmployeesErrorsCount++;
  return importEmployeesErrorsCount;
}

async function departmentExistsAsync(id: Types.ObjectId): Promise<boolean> {
  if(id) {
    const department = await DepartmentModel.findById(id);
    if(!department) {
       return false;       
    }
  }
  return true;
}
  
function validateCSVBuffer(fileBuffer: Buffer): void {
  const content = fileBuffer.toString("utf-8");
  const lines = content.split(/\r?\n/).filter(Boolean); 

  if (lines.length === 0) {
    throw new Error("CSV file is empty");
  }

  // First line = header
  const headerLine = lines[0];
  const headers: string[] = headerLine.split(",").filter(Boolean);

  if (headers.length !== EXPECTED_HEADERS.length) {
    throw new Error(
      `Invalid number of columns in header. Expected ${EXPECTED_HEADERS.length}, but got ${headers.length}`
    );
  }

  for (let i = 0; i < EXPECTED_HEADERS.length; i++) {
    if (headers[i].trim() !== EXPECTED_HEADERS[i]) {
      throw new Error(
        `Invalid header at column ${i + 1}. Expected "${EXPECTED_HEADERS[i]}" but got "${headers[i]}"`
      );
    }
  }
}

import { Types } from "mongoose";
import { ImportEmployee } from "../interface/importEmployee";

export async function parseImportEmployeeCsvBuffer(
  fileBuffer: Buffer,
  importEmployeesId: Types.ObjectId | null
): Promise<ImportEmployee[]> {
  const lines = fileBuffer.toString("utf-8").split(/\r?\n/);

  const employees: ImportEmployee[] = [];

  for (const line of lines) {
    const employee = parseEmployeeFromCsv(line, importEmployeesId);
    if (employee) employees.push(employee);
  }

  return employees;
} 

export function parseEmployeeFromCsv(line: string, importEmployeesId: Types.ObjectId | null): ImportEmployee | null { 
  
  line = line.trim();
  if (!line) return null;

  const columns = line.split(",").map(c => c.trim());
 
  if (columns.length < 8) return null; 
  const [  
    id,
    surname,
    firstName,
    dateOfBirth,
    hireDate,
    departmentId,
    email,
    phoneNumber
  ] = columns;
 
  if (surname?.toLowerCase() === "surname") return null;

  return { 
    surname: surname || "",
    firstName: firstName || "",
    dateOfBirth: dateOfBirth, // ? new Date(dateOfBirth) : null,
    hireDate: hireDate, //hireDate ? new Date(hireDate) : undefined,
    email: email || "",
    phoneNumber: phoneNumber || "",
    departmentId: Types.ObjectId.isValid(departmentId) 
      ? new Types.ObjectId(departmentId)
      : undefined,
    importEmployeesId: importEmployeesId || undefined,
    createdAt: new Date(),
  };
}
  
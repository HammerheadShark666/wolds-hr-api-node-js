import { Types } from "mongoose";
import { ImportEmployee } from "../interface/importEmployee";

// export async function parseImportEmployeeCsvBuffer(
//   fileBuffer: Buffer,
//   importEmployeesId: Types.ObjectId | null
// ): Promise<ImportEmployee[]> {
//   const lines = fileBuffer.toString("utf-8").split(/\r?\n/);

//   const employees: ImportEmployee[] = [];

//   for (const line of lines) {
//     const employee = parseEmployeeFromCsv(line, importEmployeesId);
//     if (employee) employees.push(employee);
//   }

//   return employees;
// } 

 

// export function parseEmployeeFromCsv(line: string, importEmployeesId: Types.ObjectId | null): ImportEmployee | null { 
  
//   line = line.trim();
//   if (!line) return null;

//   const columns = line.split(",").map(c => c.trim());
 
//   if (columns.length < 8) return null; 
//   const [  
//     id,
//     surname,
//     firstName,
//     dateOfBirth,
//     hireDate,
//     departmentId,
//     email,
//     phoneNumber
//   ] = columns;
 
//   if (surname?.toLowerCase() === "surname") return null;

//   return { 
//     surname: surname || "",
//     firstName: firstName || "",
//     dateOfBirth: dateOfBirth,
//     hireDate: hireDate,
//     email: email || "",
//     phoneNumber: phoneNumber || "",
//     departmentId: Types.ObjectId.isValid(departmentId) 
//       ? new Types.ObjectId(departmentId)
//       : undefined,
//     importEmployeesId: importEmployeesId || undefined,
//     createdAt: new Date(),
//   };
// }



// import { z } from "zod";

// const headerSchema = z.array(z.string()).nonempty();

// function makeRowSchema(expectedCols: number) {
//   return z.array(z.string()).superRefine((row, ctx) => {
//     if (row.length !== expectedCols) {
//       ctx.addIssue({
//         code: "custom",
//         message: `Row has ${row.length} columns, expected ${expectedCols}`,
//       });
//     }
//   });
// }
  
// export function parseImportEmployeeCsvBuffer2(fileBuffer: Buffer, importId: Types.ObjectId) {
//   const content = fileBuffer.toString("utf-8");
//   const lines = content.split(/\r?\n/).filter((line) => line.trim() !== "");

//   if (lines.length === 0) {
//     throw new Error("CSV file is empty");
//   }

//   // First line = header
//   const headerCols = lines[0].split(",");
//   headerSchema.parse(headerCols);
//   const expectedCols = headerCols.length;

//   const rowSchema = makeRowSchema(expectedCols);

//   const valid: any[] = [];
//   const invalid: { row: number; values: string[]; errors: any }[] = [];

//   lines.slice(1).forEach((line, idx) => {
//     const rowNumber = idx + 2; // +2 because first row is header
//     const cols = line.split(",");

//     const result = rowSchema.safeParse(cols);

//     if (result.success) {
//       // Map into Employee object (adapt to your schema)
//       const employee = {
//         importId,
//         surname: cols[0],
//         firstName: cols[1],
//         dateOfBirth: cols[2] || null,
//         // etc...
//       };
//       valid.push(employee);
//     } else {
//       invalid.push({
//         row: rowNumber,
//         values: cols,
//         errors: result.error.issues.map((e) => e.message),
//       });
//     }
//   });

//   return { valid, invalid, header: headerCols };
// }

 import { z } from "zod";

function makeRowSchema(expectedCols: number) {
  return z.array(z.string()).superRefine((row, ctx) => {
    if (row.length !== expectedCols) {
      ctx.addIssue({
        code: "custom",
        message: `Row has ${row.length} columns, expected ${expectedCols}`,
      });
    }
  });
}

export function parseImportEmployeeCsvBuffer(fileBuffer: Buffer, importEmployeesId: Types.ObjectId | null) {
  const content = fileBuffer.toString("utf-8");
  const lines = content.split(/\r?\n/).filter((line) => line.trim() !== "");

  if (lines.length === 0) {
    throw new Error("CSV file is empty");
  }

  const headerCols = lines[0].split(",");
  const expectedCols = headerCols.length;
  const rowSchema = makeRowSchema(expectedCols);

  const validEmployees: ImportEmployee[] = [];
  const invalidEmployees: string[] = [];

  lines.slice(1).forEach((line) => {
    const cols = line.split(",");

    const result = rowSchema.safeParse(cols);

    if (result.success) {
      // destructure based on header order
      const [
        Id,
        surname,
        firstName,
        dateOfBirth,
        hireDate,
        departmentId,
        email,
        phoneNumber,        
      ] = cols;

      validEmployees.push({
        surname: surname || "",
        firstName: firstName || "",
        dateOfBirth: dateOfBirth || null,
        hireDate: hireDate || null,
        email: email || "",
        phoneNumber: phoneNumber || "",
        departmentId: Types.ObjectId.isValid(departmentId)
          ? new Types.ObjectId(departmentId)
          : undefined,
        importEmployeesId: importEmployeesId || undefined,
        createdAt: new Date(),
      });
    } else {
      // return original row as CSV string
      invalidEmployees.push(cols.join(","));
    }
  });

  return { validEmployees, invalidEmployees };
}
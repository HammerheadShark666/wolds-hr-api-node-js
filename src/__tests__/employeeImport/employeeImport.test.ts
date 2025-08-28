import path from "path"; 
import { deleteImportedEmployeesAsync, postImportEmployeeAsync } from "./helpers/request.helper";   
import { objectIdSchema } from "../../validation/fields/objectId.schema";
import { todaysDateSchema } from "../../validation/fields/todaysDate.schema";

let importEmployeesId: string = ""

afterAll(async () => {
  const res = await deleteImportedEmployeesAsync(importEmployeesId);
  expect(res.status).toBe(200);   
}); 

describe('Import employees from file', () => {
   
  it('should import employees successfully', async () => {
  
    const filePath = path.join(__dirname, '../files', 'employee-imports.csv');

    if(global.ACCESS_TOKEN == null)
      throw new Error("Access token is missing"); 
 
    const response = await postImportEmployeeAsync(filePath); 
 
    expect(response.status).toBe(200);    

    importEmployeesId = response.body.id; 
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('importedEmployeesCount');   
    expect(response.body).toHaveProperty('importEmployeesExistingCount');
    expect(response.body).toHaveProperty('importEmployeesErrorsCount');
    expect(typeof response.body.id).toBe('string'); 
    expect(typeof response.body.date).toBe('string');
    expect(typeof response.body.importedEmployeesCount).toBe('number');
    expect(typeof response.body.importEmployeesExistingCount).toBe('number');
    expect(typeof response.body.importEmployeesErrorsCount).toBe('number'); 

    const idResult = objectIdSchema.safeParse(response.body.id);
    expect(idResult.success).toBe(true);

    const dateResult = todaysDateSchema.safeParse(response.body.date);
    expect(dateResult.success).toBe(true);

    expect(response.body.importedEmployeesCount).toEqual(10);
    expect(response.body.importEmployeesExistingCount).toEqual(2);
    expect(response.body.importEmployeesErrorsCount).toEqual(7); 
  });
    
  it('should fail to import as file invalid data', async () => {
  
    const filePath = path.join(__dirname, '../files', 'employee-imports-invalid.csv');

    if(global.ACCESS_TOKEN == null)
      throw new Error("Access token is missing"); 
 
    const response = await postImportEmployeeAsync(filePath); 
 
    expect(response.status).toBe(500);    
 
  });
});
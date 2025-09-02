import path from "path";
import request from "supertest";
import { objectIdSchema } from "../../validation/fields/objectId.schema";
import { todaysDateSchema } from "../../validation/fields/todaysDate.schema";
import { withAuth } from "../utils/request.helper";

let importEmployeesId = "";
const baseUrl = '/v1/import/employees';  

async function importEmployeeRequest(method: "post"|"delete", path: string, data?: string) {  
  let req =  request(global.app!)[method](`${baseUrl}${path}`);  
  if ((method === "post") && data) req = req.set("Content-Type", "application/json").attach('importFile', data);
  return await withAuth(req);
}
 
function expectImportResults(
  response: any,
  { imported, existing, errors }: { imported: number; existing: number; errors: number }
) {
  const body = response.body;

  // Structure
  expect(body).toMatchObject({
    id: expect.any(String),
    importedEmployeesCount: expect.any(Number),
    importEmployeesExistingCount: expect.any(Number),
    importEmployeesErrorsCount: expect.any(Number),
    date: expect.any(String),
  });

  // Schema checks
  expect(objectIdSchema.safeParse(body.id).success).toBe(true);
  expect(todaysDateSchema.safeParse(body.date).success).toBe(true);

  // Value checks
  expect(body.importedEmployeesCount).toBe(imported);
  expect(body.importEmployeesExistingCount).toBe(existing);
  expect(body.importEmployeesErrorsCount).toBe(errors);
}

// --- Cleanup ---
afterEach(async () => { 
  if (importEmployeesId) {  
    const response = await importEmployeeRequest("delete", `/history/${importEmployeesId}`); 
    expect(response.status).toBe(200);
  }
});

// --- Tests ---
describe("Import employees from file", () => {
  it("should import employees successfully", async () => { 

    const filePath = path.join(__dirname, "../files", "employee-imports.csv"); 
    const response = await importEmployeeRequest("post", ``, filePath);

    expect(response.status).toBe(200);

    importEmployeesId = response.body.id;
    expectImportResults(response, { imported: 10, existing: 2, errors: 8 });
  });

  it("should fail to import as file contains invalid data", async () => { 

    const filePath = path.join(__dirname, "../files", "employee-imports-invalid.csv");   
    const response = await importEmployeeRequest("post", ``, filePath);

    expect(response.status).toBe(200);
    importEmployeesId = response.body.id;
    expectImportResults(response, { imported: 0, existing: 0, errors: 5 });
  });
});

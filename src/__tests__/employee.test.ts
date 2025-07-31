import request from 'supertest';   
import { expectError } from '../utils/error.helper';

describe("GET /api/v1/employees", () => { 

  it("should return 200 and search results", async () => {
  
    const response = await getSearchEmployees({}); 
    
    console.log(response.body);
   // console.log(response.body.employees);

    expect(response.status).toBe(200); 
    expect(Array.isArray(response.body.employees)).toBe(true);
    expect(response.body.employees.length).toBeGreaterThanOrEqual(5);
 

    const employee = response.body.employees[0];
    expect(employee).toBeDefined();
    expect(employee).toHaveProperty("id");
    expect(employee).toHaveProperty("surname");  
    expect(employee).toHaveProperty("firstName");  
  });
});


function getSearchEmployees(params?: object) {

  if(global.ACCESS_TOKEN == null)
    throw new Error("Access token is missing");

  let req = request(global.app!)
    .get("/v1/employees/search?keyword=john&page=1&pageSize=5")
      .set("Cookie", [global.ACCESS_TOKEN]);

  if (params !== undefined) {
    req = req.query(params);
  }

  return req;
}
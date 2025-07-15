import request from 'supertest';   

let departmentId = '';
const departmentName = 'Warehouse';
const updateDepartmentName = 'R&D';
const invalidDepartmentId = "9c2d0e11-ef0e-4fed-92a0-549a4af6912"

beforeAll(async () => { 

  // Add a new department, save department id to use in tests  

  const response = await request(global.app!)
    .post("/v1/departments")
      .set('Authorization', `Bearer ${global.ACCESS_TOKEN}`)
      .set("Content-Type", "application/json")
      .send({ name: departmentName });

  expect(response.status).toBe(200);   

  const department = response.body;

  expect(department).toBeDefined();
  expect(department).toHaveProperty("id");
  expect(department).toHaveProperty("name");  

  expect(typeof department.id).toBe('string');  
  expect(typeof department.name).toBe('string');  
  expect(department.name).toBe(departmentName);

  departmentId = department.id;
});

describe("GET /api/v1/departments", () => { 

  it("should return 200 and all departments", async () => {
  
    const response = await request(global.app!)
      .get("/v1/departments")
        .set('Authorization', `Bearer ${global.ACCESS_TOKEN}`)
        .set("Content-Type", "application/json");

    expect(response.status).toBe(200); 
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(0);

    const department = response.body[0];

    expect(department).toBeDefined();
    expect(department).toHaveProperty("id");
    expect(department).toHaveProperty("name");  
  });
});
    
describe("POST /api/v1/departments", () => { 
 
  it("should return 400 and error Department name required", async () => {
    
    const response = await request(global.app!)
      .post("/v1/departments")
        .set('Authorization', `Bearer ${global.ACCESS_TOKEN}`)
        .set("Content-Type", "application/json")
        .send({ name: '' }); 

    expect(response.status).toBe(400);    
    expect(response.body).toHaveProperty('error');  
    expect(response.body.error).toMatch('Department name required'); 
  });

  it("should return 400 and error Department already exists", async () => {
    
    const response = await request(global.app!)
      .post("/v1/departments")
        .set('Authorization', `Bearer ${global.ACCESS_TOKEN}`)
        .set("Content-Type", "application/json")
        .send({ name: departmentName }); 

    expect(response.status).toBe(400);    
    expect(response.body).toHaveProperty('error');  
    expect(response.body.error).toMatch('Department already exists'); 
  });
});

describe("GET /api/v1/departments/:id", () => { 

  it("should return 200 and department", async () => {
  
    const response = await request(global.app!)
      .get("/v1/departments/"  + departmentId)
        .set('Authorization', `Bearer ${global.ACCESS_TOKEN}`)
        .set("Content-Type", "application/json");

    expect(response.status).toBe(200); 

    const department = response.body;

    expect(department).toBeDefined();
    expect(department).toHaveProperty("id");
    expect(department).toHaveProperty("name");  

    expect(department.id).toBe(departmentId);
    expect(department.name).toBe(departmentName); 
  });

  it("should return 404 and error Department not found", async () => {
     
    const response = await request(global.app!)
      .get("/v1/departments/" + invalidDepartmentId)
        .set('Authorization', `Bearer ${global.ACCESS_TOKEN}`)
        .set("Content-Type", "application/json"); 

    expect(response.status).toBe(404);    
    expect(response.body).toHaveProperty('error');  
    expect(response.body.error).toMatch('Department not found'); 
  });
});
  
describe("PUT /api/v1/departments", () => {  

  it("should return 200 and department", async () => { 

    const response = await request(global.app!)
      .put("/v1/departments")
        .set('Authorization', `Bearer ${global.ACCESS_TOKEN}`)
        .set("Content-Type", "application/json")
        .send({ id: departmentId, name: updateDepartmentName });
 
    expect(response.status).toBe(200);   

    const department = response.body;

    expect(department).toBeDefined();
    expect(department).toHaveProperty("id");
    expect(department).toHaveProperty("name");  
 
    expect(typeof department.id).toBe('string');  
    expect(typeof department.name).toBe('string');  
    expect(department.name).toBe(updateDepartmentName); 
  });
  
  it("should return 404 and error Department not found", async () => {
      
    const response = await request(global.app!)
      .put("/v1/departments")
        .set('Authorization', `Bearer ${global.ACCESS_TOKEN}`)
        .set("Content-Type", "application/json")
        .send({ id: invalidDepartmentId, name: departmentName }); 

    expect(response.status).toBe(404);    
    expect(response.body).toHaveProperty('error');  
    expect(response.body.error).toMatch('Department not found'); 
  });
});
 
describe("DELETE /api/v1/departments/:id", () => { 

  it("should return 200 and message Department deleted", async () => {
  
    const departmentName = 'Warehouse'; 

    const response = await request(global.app!)
      .delete("/v1/departments/" + departmentId)
        .set('Authorization', `Bearer ${global.ACCESS_TOKEN}`)
        .set("Content-Type", "application/json")
        .send({ name: departmentName }); 

    expect(response.status).toBe(200);    
    expect(response.body).toHaveProperty('message');  
    expect(response.body.message).toMatch('Department deleted'); 
  });  

  it("should return 404 and error Department not found", async () => {
     
    const response = await request(global.app!)
      .delete("/v1/departments/" + invalidDepartmentId)
        .set('Authorization', `Bearer ${global.ACCESS_TOKEN}`)
        .set("Content-Type", "application/json"); 

    expect(response.status).toBe(404);    
    expect(response.body).toHaveProperty('error');  
    expect(response.body.error).toMatch('Department not found'); 
  });
});
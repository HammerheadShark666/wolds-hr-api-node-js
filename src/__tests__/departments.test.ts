import request from 'supertest';   

let departmentId = ''; 
const departmentName = 'Warehouse';
const updateDepartmentName = 'R&D';
const invalidDepartmentId = "6877849fd6fc22ad3cdca489"

beforeAll(async () => { 
  
  const response = await request(global.app!)
    .post("/v1/departments")
      .set('Authorization', `Bearer ${global.ACCESS_TOKEN}`)
      .set("Content-Type", "application/json")
      .send({ name: departmentName }); 

  expect(response.status).toBe(200);    
  expect(response.body).toBeDefined();
  expect(response.body).toHaveProperty("id");
  expect(response.body).toHaveProperty("name");   
  expect(typeof response.body.id).toBe('string');  
  expect(typeof response.body.name).toBe('string');  
  expect(response.body.name).toBe(departmentName);

  departmentId = response.body.id;
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
 
  it("should return 400 and error when no department name", async () => {
    
    const response = await request(global.app!)
      .post("/v1/departments")
        .set('Authorization', `Bearer ${global.ACCESS_TOKEN}`)
        .set("Content-Type", "application/json")
        .send({ name: '' }); 

    expect(response.status).toBe(400);     
    expect(response.body).toHaveProperty('errors');  
    expect(response.body.errors[0]).toMatch('Department name must be at least 2 characters'); 
  });

  it("should return 400 and error when department already exists", async () => {
    
    const response = await request(global.app!)
      .post("/v1/departments")
        .set('Authorization', `Bearer ${global.ACCESS_TOKEN}`)
        .set("Content-Type", "application/json")
        .send({ name: departmentName }); 
        
    expect(response.status).toBe(400);    
    expect(response.body).toHaveProperty('errors');  
    expect(response.body.errors[0]).toMatch('Department name already exists'); 
  });
});

describe("GET /api/v1/departments/:id", () => { 

  it("should return 200 and department", async () => {
  
    const response = await request(global.app!)
      .get("/v1/departments/"  + departmentId)
        .set('Authorization', `Bearer ${global.ACCESS_TOKEN}`)
        .set("Content-Type", "application/json");

    expect(response.status).toBe(200);   
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name"); 
    expect(response.body.id).toBe(departmentId);
    expect(response.body.name).toBe(departmentName); 
  });

  it("should return 400 and error when department not found", async () => {
     
    const response = await request(global.app!)
      .get("/v1/departments/" + invalidDepartmentId)
        .set('Authorization', `Bearer ${global.ACCESS_TOKEN}`)
        .set("Content-Type", "application/json"); 

    expect(response.status).toBe(400);    
    expect(response.body).toHaveProperty('errors');  
    expect(response.body.errors[0]).toMatch('Department not found'); 
  });
 });
  
describe("PUT /api/v1/departments", () => {  

  it("should return 200 and department when department updated", async () => { 

    const response = await request(global.app!)
      .put("/v1/departments/" + departmentId)
        .set('Authorization', `Bearer ${global.ACCESS_TOKEN}`)
        .set("Content-Type", "application/json")
        .send({ name: updateDepartmentName }); 
 
    expect(response.status).toBe(200);    
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");  
 
    expect(typeof response.body.id).toBe('string');  
    expect(typeof response.body.name).toBe('string');  
    expect(response.body.name).toBe(updateDepartmentName); 
  });
  
  it("should return 400 and error when department not found", async () => {
      
    const response = await request(global.app!)
      .put("/v1/departments/" + invalidDepartmentId)
        .set('Authorization', `Bearer ${global.ACCESS_TOKEN}`)
        .set("Content-Type", "application/json")
        .send({ name: departmentName }); 

    expect(response.status).toBe(400);    
    expect(response.body).toHaveProperty('errors');  
    expect(response.body.errors[0]).toMatch('Department not found'); 
  });
});
 
describe("DELETE /api/v1/departments/:id", () => { 

  it("should return 200 and message when deleted", async () => {
  
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

  it("should return 400 and error when department not found", async () => {
     
    const response = await request(global.app!)
      .delete("/v1/departments/" + invalidDepartmentId)
        .set('Authorization', `Bearer ${global.ACCESS_TOKEN}`)
        .set("Content-Type", "application/json"); 

    expect(response.status).toBe(400);    
    expect(response.body).toHaveProperty('errors');  
    expect(response.body.errors[0]).toMatch('Department not found'); 
  });
});
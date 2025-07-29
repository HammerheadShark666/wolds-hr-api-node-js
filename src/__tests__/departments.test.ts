import request from 'supertest';   
import { expectError } from '../utils/error.helper';

let departmentId = ''; 
const departmentName = 'Warehouse';
const updateDepartmentName = 'R&D';
const invalidDepartmentId = "6877849fd6fc22ad3cdca489"

beforeAll(async () => { 
  
  const response = await postDepartment({ name: departmentName });
  expect(response.status).toBe(201);    
  expect(response.body).toBeDefined();
  expect(response.body).toHaveProperty("id");
  expect(response.body).toHaveProperty("name");   
  expect(typeof response.body.id).toBe("string");  
  expect(typeof response.body.name).toBe("string");  
  expect(response.body.name).toBe(departmentName);

  departmentId = response.body.id;
});

describe("GET /api/v1/departments", () => { 

  it("should return 200 and all departments", async () => {
  
    const response = await getDepartments({}); 
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
    const response = await postDepartment({ name: '' });
    expectError(response, 'Department name must be at least 2 characters', 400);
  });

  it("should return 400 and error when department already exists", async () => {        
    const response = await postDepartment({ name: departmentName });
    expectError(response, 'Department name already exists', 400);
  });
});

describe("GET /api/v1/departments/:id", () => { 

  it("should return 200 and department", async () => {  
    const response = await getDepartmentById(departmentId);
    expect(response.status).toBe(200);   
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name"); 
    expect(response.body.id).toBe(departmentId);
    expect(response.body.name).toBe(departmentName); 
  });

  it("should return 400 and error when department not found", async () => {     
    const response = await getDepartmentById(invalidDepartmentId);
    expectError(response, 'Department not found', 400);
  });
 });
  
describe("PUT /api/v1/departments", () => {  

  it("should return 200 and department when department updated", async () => {
    const response = await putDepartment(departmentId, updateDepartmentName); 
    expect(response.status).toBe(200);    
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty("departmentId");
    expect(response.body).toHaveProperty("message");   
    expect(typeof response.body.departmentId).toBe("string");  
    expect(typeof response.body.message).toBe("string");  
    expect(response.body.departmentId).toBe(departmentId); 
    expect(response.body.message).toBe("Department updated successfully")
  });
  
  it("should return 400 and error when department not found", async () => {       
    const response = await putDepartment(invalidDepartmentId, departmentName);
    expectError(response, 'Department not found', 400);
  });
});
 
describe("DELETE /api/v1/departments/:id", () => { 

  it("should return 200 and message when deleted", async () => {    
    const response = await deleteDepartment(departmentId);
    expect(response.status).toBe(200);    
    expect(response.body).toHaveProperty('message');  
    expect(response.body.message).toMatch('Department deleted'); 
  });  

  it("should return 400 and error when department not found", async () => {      
    const response = await deleteDepartment(invalidDepartmentId);
    expectError(response, 'Department not found', 400);
  });
});


function postDepartment(data?: object) {
  const req = request(global.app!)
    .post("/v1/departments")
      .set('Authorization', `Bearer ${global.ACCESS_TOKEN}`)
      .set("Content-Type", "application/json");
  
  if (data !== undefined) {
    return req.send(data);
  }
  return req.send();
}
 
function getDepartments(params?: object) {
  let req = request(global.app!)
    .get("/v1/departments")
      .set('Authorization', `Bearer ${global.ACCESS_TOKEN}`);

  if (params !== undefined) {
    req = req.query(params);
  }

  return req;
}

function putDepartment(departmentId: string, data: string) {
  return request(global.app!)
    .put(`/v1/departments/${departmentId}`)
      .set('Authorization', `Bearer ${global.ACCESS_TOKEN}`)
      .set('Content-Type', 'application/json')
      .send({ name: data });
}

function deleteDepartment(id: string) {
  return request(global.app!)
    .delete(`/v1/departments/${id}`)
      .set('Authorization', `Bearer ${global.ACCESS_TOKEN}`);
}

function getDepartmentById(departmentId: string) {
  return request(global.app!)
    .get(`/v1/departments/${departmentId}`)
      .set('Authorization', `Bearer ${global.ACCESS_TOKEN}`)
      .set('Content-Type', 'application/json');
}
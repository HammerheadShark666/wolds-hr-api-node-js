import request from 'supertest';
 
const role = 'user';
const invalidEmail = 'sdkjf@ldjsdkjf.com'
const invalidUserId = '6877239ab6fc76ad4cdca645'
 
describe("GET /api/v1/users/:email", () => { 

  it("should return 200 and user details ", async () => {
      
    const response = await request(global.app!)
      .get(`/v1/users/email/${global.username}`) 
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${global.ACCESS_TOKEN}`)
        .send(); 

    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty("id");
    expect(typeof response.body.id).toBe('string');  
    expect(response.body).toHaveProperty("username");
    expect(typeof response.body.id).toBe('string');  
    expect(response.body).toHaveProperty("role");
    expect(typeof response.body.id).toBe('string');  

    expect(response.body.username).toBe(global.username); 
    expect(response.body.role).toBe(role);
  });

  it("should return 404 and error User not found", async () => {
      
    const response = await request(global.app!)
      .get(`/v1/users/email/`) 
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${global.ACCESS_TOKEN}`)
        .send();  

    expect(response.status).toBe(404);
  });

  it("should return 404 and error User not found", async () => {
      
    const response = await request(global.app!)
      .get(`/v1/users/email/${invalidEmail}`) 
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${global.ACCESS_TOKEN}`)
        .send(); 

    expect(response.status).toBe(404);    
    expect(response.body).toHaveProperty('error');  
    expect(response.body.error).toMatch('User not found'); 
  });
});

describe("GET /api/v1/users/:id", () => { 

  it("should return 200 and user details ", async () => {
       
    const response = await request(global.app!)
      .get(`/v1/users/id/${global.userId}`) 
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${global.ACCESS_TOKEN}`)
        .send(); 

    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty("id");
    expect(typeof response.body.id).toBe('string');  
    expect(response.body).toHaveProperty("username");
    expect(typeof response.body.id).toBe('string');  
    expect(response.body).toHaveProperty("role");
    expect(typeof response.body.id).toBe('string');  

    expect(response.body.username).toBe(global.username); 
    expect(response.body.role).toBe(role);
  });

  it("should return 404 and error User not found", async () => {
      
    const response = await request(global.app!)
      .get(`/v1/users/id/`) 
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${global.ACCESS_TOKEN}`)
        .send();  
        
    expect(response.status).toBe(404);
  });

  it("should return 404 and error User not found", async () => {
      
    const response = await request(global.app!)
      .get(`/v1/users/id/${invalidUserId}`) 
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${global.ACCESS_TOKEN}`)
        .send(); 

    expect(response.status).toBe(404);    
    expect(response.body).toHaveProperty('error');  
    expect(response.body.error).toMatch('User not found'); 
  });
});
 
describe("PUT /api/v1/users", () => {  

  const updateUsername = "john3@hotmail.com";
  const updateRole = "admin";
  const invalidRole = "test";
  const invalidId = "6873423ab6fc23ad4cdca777";
  const existingUsername = "john@hotmail.com";

  it("should return 200 and department", async () => { 

    const response = await request(global.app!)
      .put("/v1/users")
        .set('Authorization', `Bearer ${global.ACCESS_TOKEN}`)
        .set("Content-Type", "application/json")
        .send({ id: global.userId, username: updateUsername, role: updateRole });
 
    expect(response.status).toBe(200);    
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("username");  
    expect(response.body).toHaveProperty("role");  
 
    expect(typeof response.body.id).toBe('string');  
    expect(typeof response.body.username).toBe('string');  
    expect(response.body.username).toBe(updateUsername);
    expect(response.body.role).toBe(updateRole);
  })
  
  it("should return 400 and error Invalid role", async () => {
      
    const response = await request(global.app!)
      .put("/v1/users")
        .set('Authorization', `Bearer ${global.ACCESS_TOKEN}`)
        .set("Content-Type", "application/json")
        .send({ id: userId, username: updateUsername, role: invalidRole });
  
    expect(response.status).toBe(400);    
    expect(response.body).toHaveProperty('error');  
    expect(response.body.error).toMatch('Validation failed: role: `test` is not a valid enum value for path `role`.'); 
  });

  it("should return 404 and error User not found", async () => {
      
    const response = await request(global.app!)
      .put("/v1/users")
        .set('Authorization', `Bearer ${global.ACCESS_TOKEN}`)
        .set("Content-Type", "application/json")
        .send({ id: invalidId, username: updateUsername, role: updateRole });
  
    expect(response.status).toBe(404);    
    expect(response.body).toHaveProperty('error');  
    expect(response.body.error).toMatch('User not found'); 
  });

  it("should return 400 and error User with the usename already exists", async () => {
      
    const response = await request(global.app!)
      .put("/v1/users")
        .set('Authorization', `Bearer ${global.ACCESS_TOKEN}`)
        .set("Content-Type", "application/json")
        .send({ id: global.userId, username: existingUsername, role: updateRole });
  
    expect(response.status).toBe(400);    
    expect(response.body).toHaveProperty('error');  
    expect(response.body.error).toMatch('User with the usename already exists'); 
  });
});
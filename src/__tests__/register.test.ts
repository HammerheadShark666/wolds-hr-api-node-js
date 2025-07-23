import request from 'supertest';

const username = 'testregister@hotmail.com';
const invalidPasswordUsername = 'testregisterinvalid@hotmail.com';
const password = 'Password#1';
let userId = '';
 
describe("POST /api/v1/register", () => { 

  it("should return 200 and user id when register successful ", async () => {
    
    const response = await request(global.app!)
      .post("/v1/register") 
        .set("Content-Type", "application/json")
        .send({username: username, password: password, confirmPassword: password}); 
 
    expect(response.status).toBe(200);    
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty("userId");
    expect(typeof response.body.userId).toBe('string'); 
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toMatch("User registered successfully");  

    userId = response.body.userId;
  });

   it("should return 400 and error when username already exists ", async () => {
    
    const response = await request(global.app!)
      .post("/v1/register") 
        .set("Content-Type", "application/json")
        .send({username: username, password: password, confirmPassword: password}); 
 
    expect(response.status).toBe(400);    
    expect(response.body).toBeDefined();  
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0]).toMatch("Username already exists");  
  });

  it("should return 400 and error when no username passed ", async () => {
     
    const response = await request(global.app!)
      .post("/v1/register") 
        .set("Content-Type", "application/json")
        .send({ username: '', password: '', confirmPassword: '' });

    expect(response.status).toBe(400);     
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toBeInstanceOf(Array);
    expect(response.body.errors[0]).toMatch('Invalid email format');
  });

  it("should return 400 and error when invalid username", async () => {
    const response = await request(global.app!)
      .post("/v1/register") 
        .set("Content-Type", "application/json")
        .send({ username: 'testusername', password: password, confirmPassword: password });

    expect(response.status).toBe(400);    
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toBeInstanceOf(Array);
    expect(response.body.errors[0]).toMatch('Invalid email format'); 
  });

  it("should return 400 and error when password not long enough, no uppercase, number, special character", async () => {
    const response = await request(global.app!)
      .post("/v1/register") 
        .set("Content-Type", "application/json")
        .send({ username: username, password: "dfdf", confirmPassword: "dfdf" });

    expect(response.status).toBe(400);    

    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toBeInstanceOf(Array);
    expect(response.body.errors[0]).toMatch('Password must be at least 8 characters long'); 
    expect(response.body.errors[1]).toMatch('Password must contain at least one uppercase letter'); 
    expect(response.body.errors[2]).toMatch('Password must contain at least one number'); 
    expect(response.body.errors[3]).toMatch('Password must contain at least one special character'); 
  });

  it("should return 400 and error when password has no lowercase", async () => {
    const response = await request(global.app!)
      .post("/v1/register") 
        .set("Content-Type", "application/json")
        .send({ username: username, password: "PASSWORD#1", confirmPassword: "PASSWORD#1" });

    expect(response.status).toBe(400);    

    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toBeInstanceOf(Array); 
    expect(response.body.errors[0]).toMatch('Password must contain at least one lowercase letter');  
  });  

  it("should return 400 and error when passwords not the same ", async () => {
    const response = await request(global.app!)
      .post("/v1/register") 
        .set("Content-Type", "application/json")
        .send({ username: username, password: 'Password#3', confirmPassword: 'Password#4' });

    expect(response.status).toBe(400);     
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toBeInstanceOf(Array);
    expect(response.body.errors[0]).toMatch('Passwords do not match'); 
  }); 

  it("delete registered user, should return 200 when deleted", async () => {

    const response = await request(global.app!)
        .delete(`/v1/users/${userId}`)
        .set('Authorization', `Bearer ${global.ACCESS_TOKEN || ''}`)
        .send();
  
    expect(response.status).toBe(200);    
    expect(response.body).toHaveProperty('message');  
    expect(response.body.message).toMatch('User deleted'); 
  });  
});  
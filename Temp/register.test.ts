import request from 'supertest';

const username = 'testregister@hotmail.com';
const password = 'Password#1';
let userId = '';
 
describe("POST /api/v1/register", () => { 

  it("should return 200 and user id ", async () => {
    
    const response = await request(global.app!)
      .post("/v1/register") 
        .set("Content-Type", "application/json")
        .send({username: username, password: password}); 
 
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty("userId");
    expect(typeof response.body.userId).toBe('string'); 
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toMatch("User registered successfully");  

    userId = response.body.userId;
  });

  it("should return 400 and error Username already exists", async () => {
    
    const response = await request(global.app!)
      .post("/v1/register") 
        .set("Content-Type", "application/json")
        .send({username: username, password: password}); 

    expect(response.status).toBe(400);    
    expect(response.body).toHaveProperty('error');  
    expect(response.body.error).toMatch('Username already exists'); 
  });

  it("should return 400 and error Missing fields", async () => {
    
    const response = await request(global.app!)
      .post("/v1/register") 
        .set("Content-Type", "application/json")
        .send({username: "", password: ""}); 

    expect(response.status).toBe(400);    
    expect(response.body).toHaveProperty('error');  
    expect(response.body.error).toMatch('Missing fields'); 
  });   

  it("delete registered user, should return 200 and message User deleted", async () => {
 
    const response = await request(global.app!)
        .delete(`/v1/users/${userId}`)
        .set('Authorization', `Bearer ${global.ACCESS_TOKEN || ''}`)
        .send();
  
    expect(response.status).toBe(200);    
    expect(response.body).toHaveProperty('message');  
    expect(response.body.message).toMatch('User deleted'); 
  });  
});  
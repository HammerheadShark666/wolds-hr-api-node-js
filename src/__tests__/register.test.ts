import request from 'supertest';

const username = 'john@hotmail.com';
const password = 'Password#1'; 

describe("POST /api/v1/register", () => { 
  
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
});  
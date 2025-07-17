import request from 'supertest';
 
describe("POST /api/v1/refresh-token", () => { 
 
  it("should return 200 and token ", async () => { 

    const response = await request(global.app!)
      .post("/v1/refresh-token") 
        .set("Content-Type", "application/json")
        .set("Cookie", [global.REFRESH_TOKEN!]) 
        .send(); 
 
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty("token");
    expect(typeof response.body.token).toBe('string');     
  });

   it("should return 401 ", async () => { 

    const response = await request(global.app!)
      .post("/v1/refresh-token") 
        .set("Content-Type", "application/json") 
        .send(); 
 
     expect(response.status).toBe(401);      
  });
});
import request from 'supertest';
 
describe("POST /api/v1/refresh-token", () => { 
 
  it("should return 200 and token ", async () => { 
    const response = await postRefreshToken(global.REFRESH_TOKEN!);
    expect(response.status).toBe(200); 
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty("token");
    expect(typeof response.body.token).toBe('string');     
  });

  it("should return 401 when no refresh token passed", async () => {
    const response = await postRefreshToken(""); 
    expect(response.status).toBe(401);      
  });

  it("should return 401 when no invalid refresh token passed", async () => {
    const response = await postRefreshToken("dfjletjerorgm34dfpogJ)j0s00394dpmgreojg034toeg"); 
    expect(response.status).toBe(401);      
  });
});

async function postRefreshToken(cookie: string) {
  return await request(global.app!)
      .post("/v1/refresh-token") 
        .set("Content-Type", "application/json") 
        .set("Cookie", [cookie]) 
        .send(); 
}
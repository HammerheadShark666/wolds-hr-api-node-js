import request from 'supertest';   

describe("GET /api/v1/departments", () => { 

  it("should return 200 and all departments", async () => {
  
    const response = await request(global.app!)
      .get("/v1/departments")
      .set("Content-Type", "application/json")
      .set('Authorization', `Bearer ${global.ACCESS_TOKEN}`);

    expect(response.status).toBe(200); 
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(0);

    const department = response.body[0];

    expect(department).toBeDefined();
    expect(department).toHaveProperty("id");
    expect(department).toHaveProperty("name");  
  });
});
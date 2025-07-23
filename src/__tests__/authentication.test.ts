import request from 'supertest';
  
let refreshToken = '';
 
describe("POST /api/v1/login ", () => { 

  it("should return 200, token and refresh token cookie when successfully logged in ", async () => {
 
    const username = `john@hotmail.com`;
    const password = "Password#1";

    const response = await request(global.app!)
      .post("/v1/login") 
        .set("Content-Type", "application/json")
        .send({ username, password });

    expect(response.status).toBe(200);   

    const cookiesHeader = response.headers['set-cookie'];
    const cookiesArray = Array.isArray(cookiesHeader) ? cookiesHeader : [cookiesHeader];
  
    expect(cookiesArray).toBeDefined();
    expect(Array.isArray(cookiesArray)).toBe(true);

    const refreshTokenCookie = cookiesArray.find((cookie: string) =>
    cookie.startsWith('refreshToken=')); 

    expect(refreshTokenCookie).toBeDefined();
    expect(refreshTokenCookie).toMatch(/HttpOnly/);

    const token = refreshTokenCookie!.split(';')[0].split('=')[1];
    expect(typeof token).toBe('string');
      
    refreshToken = refreshTokenCookie; 
  
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty("token");
    expect(typeof response.body.token).toBe('string');    
  }); 
});
 
describe("POST /api/v1/login (FAIL)", () => { 
  
  it("should return 400 and error when no username passed ", async () => {
   
    const response = await request(global.app!)
      .post("/v1/login") 
      .set("Content-Type", "application/json")
      .send({ username: '', password: '' });

    expect(response.status).toBe(400);     
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toBeInstanceOf(Array);
    expect(response.body.errors[0]).toMatch('Invalid email format');
  });

  it("should return 400 and error when invalid username", async () => {
    const response = await request(global.app!)
      .post("/v1/login") 
      .set("Content-Type", "application/json")
       .send({ username: 'testusername', password: password });

    expect(response.status).toBe(400);    
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toBeInstanceOf(Array);
    expect(response.body.errors[0]).toMatch('Invalid email format'); 
  });

  it("should return 400 and error when password not long enough, no uppercase, number, special character", async () => {
    const response = await request(global.app!)
      .post("/v1/login") 
      .set("Content-Type", "application/json")
       .send({ username: username, password: "dfdf" });

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
      .post("/v1/login") 
      .set("Content-Type", "application/json")
       .send({ username: username, password: "PASSWORD#1" });

    expect(response.status).toBe(400);    

    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toBeInstanceOf(Array); 
    expect(response.body.errors[0]).toMatch('Password must contain at least one lowercase letter');  
  }); 

  it("should return 400 and error when invalid password ", async () => {
    const response = await request(global.app!)
      .post("/v1/login") 
      .set("Content-Type", "application/json")
       .send({ username: username, password: 'Password#2' });

    expect(response.status).toBe(400);     
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toBeInstanceOf(Array);
    expect(response.body.errors[0]).toMatch('Username/password are invalid'); 
  });
}); 
 
describe("POST /api/v1/logout", () => { 
 
   it("should return 204 when no refresh token", async () => { 

    const response = await request(global.app!)
      .post("/v1/logout") 
        .set("Content-Type", "application/json") 
        .send(); 
 
     expect(response.status).toBe(204);      
  });

  it("should return 204 when refresh token", async () => { 

    const response = await request(global.app!)
      .post("/v1/logout") 
        .set("Content-Type", "application/json")
        .set("Cookie", [refreshToken!]) 
        .send(); 
 
    expect(response.status).toBe(204);    ;     
  }); 

  it("should return 204 when invalid refresh token", async () => { 

    const response = await request(global.app!)
      .post("/v1/logout") 
        .set("Content-Type", "application/json")
        .set("Cookie", ["dfewrvw345dfmgPFDPoip4i34[o53[45o3[45o34["]) 
        .send(); 
 
    expect(response.status).toBe(204);    ;     
  }); 
});
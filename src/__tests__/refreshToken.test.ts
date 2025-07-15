import request from 'supertest';

const username = 'john@hotmail.com';
const password = 'Password#1';

let refreshToken = '';

beforeAll(async () => { 
 
  const response = await request(global.app!)
    .post("/v1/login") 
      .set("Content-Type", "application/json")
      .send({ username: username, password: password });

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
 
describe("POST /api/v1/refresh-token", () => { 
 
  it("should return 200 and token ", async () => { 

    const response = await request(global.app!)
      .post("/v1/refresh-token") 
        .set("Content-Type", "application/json")
        .set("Cookie", [refreshToken!]) 
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
 
  
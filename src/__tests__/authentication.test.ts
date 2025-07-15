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
 
describe("POST /api/v1/login (FAIL)", () => { 

  it("should return 400 and error Missing fields ", async () => {
    const response = await request(global.app!)
      .post("/v1/login") 
      .set("Content-Type", "application/json")
      .send({ username: '', password: '' });

    expect(response.status).toBe(400);     
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty("error");
    expect(typeof response.body.error).toBe('string');
    expect(response.body.error).toMatch('Missing fields'); 
  });

  it("should return 400 and error Invalid username or password ", async () => {
    const response = await request(global.app!)
      .post("/v1/login") 
      .set("Content-Type", "application/json")
       .send({ username: 'testusername', password: 'testpassword' });

    expect(response.status).toBe(400);    
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty("error");
    expect(typeof response.body.error).toBe('string');
    expect(response.body.error).toMatch('Invalid username or password'); 
  });

  it("should return 400 and error Invalid username or password ", async () => {
    const response = await request(global.app!)
      .post("/v1/login") 
      .set("Content-Type", "application/json")
       .send({ username: username, password: 'testpassword' });

    expect(response.status).toBe(400);     
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty("error");
    expect(typeof response.body.error).toBe('string');
    expect(response.body.error).toMatch('Invalid username or password'); 
  });

}); 
 
describe("POST /api/v1/logout", () => { 
 
   it("should return 204", async () => { 

    const response = await request(global.app!)
      .post("/v1/logout") 
        .set("Content-Type", "application/json") 
        .send(); 
 
     expect(response.status).toBe(204);      
  });

  it("should return 200 and token ", async () => { 

    const response = await request(global.app!)
      .post("/v1/logout") 
        .set("Content-Type", "application/json")
        .set("Cookie", [refreshToken!]) 
        .send(); 
 
    expect(response.status).toBe(204);    ;     
  }); 
});
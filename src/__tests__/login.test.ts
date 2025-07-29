import request from 'supertest';
import { expectError } from '../utils/error.helper';
  
let refreshToken = '';
 
describe("POST /api/v1/login ", () => { 

  it("should return 200, token and refresh token cookie when successfully logged in ", async () => {
 
    const username = `john@hotmail.com`;
    const password = "Password#1";

    const response = await postLogin(username, password);

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
    expect(typeof token).toBe("string");
      
    refreshToken = refreshTokenCookie; 
  
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty("token");
    expect(typeof response.body.token).toBe("string");    
  }); 
});
 
describe("POST /api/v1/login (FAIL)", () => { 
  
  it("should return 400 and error when no username passed ", async () => {   
    const response = await postLogin('', '');
    expectError(response, 'Invalid username format', 400);
  });

  it("should return 400 and error when invalid username", async () => {  
    const response = await postLogin('testusername', password);
    expectError(response, 'Invalid username format', 400);
  });

  it("should return 400 and error when username not found", async () => {
    const response = await postLogin('testusername@hotmail.com', password);
    expectError(response, 'Invalid login', 400);
  });

  it("should return 400 and error when password not long enough, no uppercase, number, special character", async () => { 
    const response = await postLogin(username, "dfdf");
    expectError(response, 'Password must be at least 8 characters long', 400);
    expectError(response, 'Password must contain at least one uppercase letter', 400);
    expectError(response, 'Password must contain at least one number', 400);
    expectError(response, 'Password must contain at least one special character', 400);
  });

  it("should return 400 and error when password has no lowercase", async () => {   
    const response = await postLogin(username, "PASSWORD#1");
    expectError(response, 'Password must contain at least one lowercase letter', 400);
  }); 

  it("should return 400 and error when invalid password ", async () => {
    const response = await postLogin(username, "Password#2");
    expectError(response, 'Invalid login', 400);
  });
}); 
 
describe("POST /api/v1/logout", () => {  
   it("should return 204 when no refresh token", async () => { 
    const response = await postLogout(""); 
    expect(response.status).toBe(204);      
  });

  it("should return 204 when refresh token", async () => {    
    const response = await postLogout(refreshToken!); 
    expect(response.status).toBe(204);    ;     
  }); 

  it("should return 204 when invalid refresh token", async () => {    
    const response = await postLogout("dfewrvw345dfmgPFDPoip4i34[o53[45o3[45o34["); 
    expect(response.status).toBe(204);    ;     
  }); 
});

async function postLogin(username?: string, password?: string) {
  return await request(global.app!)
      .post("/v1/login") 
        .set("Content-Type", "application/json")
        .send({ username, password });
}

async function postLogout(cookie: string) {
  return await request(global.app!)
      .post("/v1/logout") 
        .set("Content-Type", "application/json")
        .set("Cookie", [cookie]) 
        .send(); 
}
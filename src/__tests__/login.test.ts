import request from 'supertest';
import { expectError } from '../utils/error.helper';
  
const username = "john@hotmail.com";
const password = "Password#1";
let refreshToken = "";
  
describe("POST /api/v1/login", () => {
  it("should return 200, set access/refresh cookies, and message", async () => {
    const response = await postLogin(username, password);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Logged in");

    const cookies = parseCookies(response.headers['set-cookie']);

    expect(cookies).toHaveProperty("access_token");
    expect(cookies).toHaveProperty("refresh_token");

    refreshToken = `refresh_token=${cookies.refresh_token}; HttpOnly`; 

    expect(typeof cookies.access_token).toBe("string");
    expect(typeof cookies.refresh_token).toBe("string");
  });
}); 

describe("POST /api/v1/login (FAIL)", () => {
  it("should return 400 when username is missing", async () => {
    const response = await postLogin('', '');
    expectError(response, 'Invalid username format', 400);
  });

  it("should return 400 when username format is invalid", async () => {
    const response = await postLogin('testusername', password);
    expectError(response, 'Invalid username format', 400);
  });

  it("should return 400 when username does not exist", async () => {
    const response = await postLogin('nonexistent@example.com', password);
    expectError(response, 'Invalid login', 400);
  });

  it("should return 400 for password that fails complexity", async () => {
    const response = await postLogin(username, "abc");
    expectError(response, 'Password must be at least 8 characters long', 400);
    expectError(response, 'Password must contain at least one uppercase letter', 400);
    expectError(response, 'Password must contain at least one number', 400);
    expectError(response, 'Password must contain at least one special character', 400);
  });

  it("should return 400 when password has no lowercase letter", async () => {
    const response = await postLogin(username, "PASSWORD#1");
    expectError(response, 'Password must contain at least one lowercase letter', 400);
  });

  it("should return 400 for incorrect password", async () => {
    const response = await postLogin(username, "Password#2");
    expectError(response, 'Invalid login', 400);
  });
}); 
  
describe("POST /api/v1/logout", () => {
  it("should return 204 when no refresh token", async () => {
    const response = await postLogout("");
    expect(response.status).toBe(204);
  });

  it("should return 204 when refresh token is valid", async () => {
    const response = await postLogout(refreshToken);
    expect(response.status).toBe(204);
  });

  it("should return 204 when refresh token is invalid", async () => {
    const response = await postLogout("invalid_token=123");
    expect(response.status).toBe(204);
  });
});

//Api functions

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
 
//Helpers

function parseCookies(setCookieHeader: string[] | string): Record<string, string> {
  const cookiesArray = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
  const cookies: Record<string, string> = {};

  cookiesArray.forEach(cookieStr => {
    const [cookiePair] = cookieStr.split(';');
    const [key, value] = cookiePair.split('=');
    cookies[key.trim()] = value;
  });

  return cookies;
}
import request from "supertest";
import { expectError } from "../utils/error.helper";

// --- Test Constants ---
const VALID_USER = { username: "john@hotmail.com", password: "Password#1" };
const INVALID_USER = { username: "nonexistent@example.com", password: "Password#1" };

let refreshTokenCookie = "";

// --- Helpers ---
async function postLogin(username?: string, password?: string) {
  return request(global.app!)
    .post("/v1/login")
    .set("Content-Type", "application/json")
    .send({ username, password });
}

async function postLogout(cookie: string) {
  return request(global.app!)
    .post("/v1/logout")
    .set("Content-Type", "application/json")
    .set("Cookie", [cookie])
    .send();
}

function parseCookies(setCookieHeader: string[] | string): Record<string, string> {
  const cookiesArray = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
  const cookies: Record<string, string> = {};

  for (const cookieStr of cookiesArray) {
    const [cookiePair] = cookieStr.split(";");
    const [key, value] = cookiePair.split("=");
    if (key && value) {
      cookies[key.trim()] = value;
    }
  }
  return cookies;
}

// --- Setup ---
beforeAll(async () => {
  const response = await postLogin(VALID_USER.username, VALID_USER.password);
  const cookies = parseCookies(response.headers["set-cookie"]);
  refreshTokenCookie = `refresh_token=${cookies.refresh_token}; HttpOnly`;
});

// --- Tests ---
describe("POST /api/v1/login", () => {
  it("should return 200 and set access/refresh cookies", async () => {
    const response = await postLogin(VALID_USER.username, VALID_USER.password);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Logged in");

    const cookies = parseCookies(response.headers["set-cookie"]);
    expect(cookies).toHaveProperty("access_token");
    expect(cookies).toHaveProperty("refresh_token");
    expect(typeof cookies.access_token).toBe("string");
    expect(typeof cookies.refresh_token).toBe("string");
  });

  it("should return 400 when username is missing", async () => {
    const res = await postLogin("", "");
    expectError(res, "Invalid username format", 400);
  });

  it("should return 400 when username format is invalid", async () => {
    const res = await postLogin("testusername", VALID_USER.password);
    expectError(res, "Invalid username format", 400);
  });

  it("should return 400 when username does not exist", async () => {
    const res = await postLogin(INVALID_USER.username, INVALID_USER.password);
    expectError(res, "Invalid login", 400);
  });

  it("should return 400 when password fails complexity", async () => {
    const res = await postLogin(VALID_USER.username, "abc");
    expectError(res, "Password must be at least 8 characters long", 400);
    expectError(res, "Password must contain at least one uppercase letter", 400);
    expectError(res, "Password must contain at least one number", 400);
    expectError(res, "Password must contain at least one special character", 400);
  });

  it("should return 400 when password has no lowercase letter", async () => {
    const res = await postLogin(VALID_USER.username, "PASSWORD#1");
    expectError(res, "Password must contain at least one lowercase letter", 400);
  });

  it("should return 400 when password is incorrect", async () => {
    const res = await postLogin(VALID_USER.username, "Password#2");
    expectError(res, "Invalid login", 400);
  });
});

describe("POST /api/v1/logout", () => {
  it("should return 204 when no refresh token is provided", async () => {
    const res = await postLogout("");
    expect(res.status).toBe(204);
  });

  it("should return 204 when refresh token is valid", async () => {
    const res = await postLogout(refreshTokenCookie);
    expect(res.status).toBe(204);
  });

  it("should return 204 when refresh token is invalid", async () => {
    const res = await postLogout("invalid_token=123");
    expect(res.status).toBe(204);
  });
});
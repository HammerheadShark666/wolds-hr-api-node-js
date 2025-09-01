import request from "supertest";

const LONG_INVALID_TOKEN = "x".repeat(500);
const FAKE_INVALID_TOKEN = "invalid_token_123";

let validRefreshToken = "";

describe("POST /api/v1/refresh-token", () => {
  beforeAll(async () => {
    // Login once to grab a real refresh token
    const loginRes = await request(global.app!)
      .post("/v1/login")
      .set("Content-Type", "application/json")
      .send({ username: "john@hotmail.com", password: "Password#1" });

    const setCookieHeader = loginRes.headers["set-cookie"];
    const refreshCookie = Array.isArray(setCookieHeader)
      ? setCookieHeader.find(c => c.startsWith("refresh_token="))
      : setCookieHeader;

    if (!refreshCookie) throw new Error("No refresh token cookie returned");
    validRefreshToken = refreshCookie;
  });

  it("should return 200 and a new token when refresh token is valid", async () => {
    const res = await postRefreshToken(validRefreshToken); 
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Token refreshed"); 
  });

  const invalidCases = [
    { name: "no refresh token", cookie: "" },
    { name: "refresh token is too long", cookie: `refresh_token=${LONG_INVALID_TOKEN}` },
    { name: "refresh token is invalid", cookie: `refresh_token=${FAKE_INVALID_TOKEN}` },
  ];

  invalidCases.forEach(({ name, cookie }) => {
    it(`should return 401 when ${name}`, async () => {
      const res = await postRefreshToken(cookie);
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("error"); // or "message", depending on your API
    });
  });
});

// --- API helper ---
function postRefreshToken(cookie: string) {
  return request(global.app!)
    .post("/v1/refresh-token")
    .set("Content-Type", "application/json")
    .set("Cookie", [cookie])
    .send();
}
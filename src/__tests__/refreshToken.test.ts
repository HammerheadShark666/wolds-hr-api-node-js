import request from 'supertest';

const LONG_INVALID_TOKEN = "x".repeat(500);
const FAKE_INVALID_TOKEN = "invalid_token_123";

describe("POST /api/v1/refresh-token", () => {

  it("should return 200 and token when refresh token is valid", async () => {
    const refreshToken = global.REFRESH_TOKEN;
    if (!refreshToken) throw new Error("Missing global.REFRESH_TOKEN");

    const response = await postRefreshToken(refreshToken);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty("message", "Token refreshed");
  });

  it("should return 401 when no refresh token is provided", async () => {
    const response = await postRefreshToken("");
    expect(response.status).toBe(401);
  });

  it("should return 401 when refresh token is too long", async () => {
    const response = await postRefreshToken(LONG_INVALID_TOKEN);
    expect(response.status).toBe(401);
  });

  it("should return 401 when refresh token is invalid", async () => {
    const response = await postRefreshToken(FAKE_INVALID_TOKEN);
    expect(response.status).toBe(401);
  });
});
 
//Api functions

function postRefreshToken(cookieValue: string) {
  return request(global.app!)
    .post("/v1/refresh-token")
    .set("Content-Type", "application/json")
    .set("Cookie", [cookieValue])
    .send();
}
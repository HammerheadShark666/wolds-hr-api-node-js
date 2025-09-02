import { Test } from "supertest";
import { AUTHENTICATION_ERRORS } from "../../utils/constants";

export function ensureAccessToken(): string {
  if (!global.ACCESS_TOKEN) {
    throw new Error(AUTHENTICATION_ERRORS.ACCESS_TOKEN_MISSING);
  }
  return global.ACCESS_TOKEN;
}
 
export function withAuth(req: Test): Test {
  const token = ensureAccessToken();
  return req.set("Cookie", [token]);
}

import request from "supertest";
import { expectError } from "../utils/error.helper";
import { withAuth } from "./utils/request.helper";
import { AddUserRequest, UserRequest } from "../interface/user";

const TEST_USER = {
  username: "testuser@hotmail.com",
  password: "Password#1",
  invalidConfirmPassword: "Password#2",
  validUsername: "testuser2@hotmail.com",
  role: "clerk",
  surname: "Test",
  firstName: "User",
  notFoundUsername: "testusernotfound@hotmail.com",
  invalidUserId: "6833339ab6fc76ad4cdca645",
  updateSurname: "TestUpdate",
  updateFirstName: "UserUpdate",
} as const

let userId = "";
const BASE_URL = "/v1/users";

beforeAll(() => {
  if (!global.ACCESS_TOKEN) throw new Error("Access token is missing");
});

describe("User API - Add", () => {
  it("should return 201 and user id when user added successfully", async () => {
    const response = await userRequest("post", ``, { username: TEST_USER.username, password: TEST_USER.password, 
                                                     confirmPassword: TEST_USER.password, surname: TEST_USER.surname, 
                                                     firstName: TEST_USER.firstName, role: TEST_USER.role });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("userId");
    userId = response.body.userId;
  });

  it("should return 400 when username already exists", async () => {
    const response = await userRequest("post", ``, { username: TEST_USER.username, password: TEST_USER.password, 
                                                     confirmPassword: TEST_USER.password, surname: TEST_USER.surname, 
                                                     firstName: TEST_USER.firstName, role: TEST_USER.role });
    expectError(response, "Username exists already", 400);
  });

  it("should return 400 when password and confirmPassword don't match", async () => {
    const response = await userRequest("post", ``, { username: TEST_USER.validUsername, password: TEST_USER.password, 
                                                     confirmPassword: TEST_USER.invalidConfirmPassword, surname: TEST_USER.surname, 
                                                     firstName: TEST_USER.firstName, role: TEST_USER.role });
    expectError(response, "Passwords do not match", 400);
  });
});

describe("User API - Get by id", () => {
  it("should return 200 and user details", async () => {
    const response = await userRequest("get", `/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ id: userId, surname: TEST_USER.surname, firstName: TEST_USER.firstName, role: TEST_USER.role });
  });

  it("should return 404 when user id is empty", async () => {
    const response = await userRequest("get", `/`); 
    expect(response.status).toBe( 404); 
  });

  it("should return 404 when user id not found", async () => {
    const response = await userRequest("get", `/${TEST_USER.invalidUserId}`);
    expect(response.status).toBe(404); 
  });
});

describe("User API - Get by username", () => {
  it("should return 200 and user details", async () => {
    const response = await userRequest("get", `/username/${TEST_USER.username}`);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ id: expect.any(String), surname: TEST_USER.surname, firstName: TEST_USER.firstName, role: TEST_USER.role });
  });

  it("should return 404 when username is empty", async () => {
    const response = await userRequest("get", `/username/`);
    expectError(response, "Invalid Id", 400);
  });

  it("should return 404 when username not found", async () => {
    const response = await userRequest("get", `/username/${TEST_USER.notFoundUsername}`);
    expectError(response, "User not found", 404);
  });
});

describe("User API - Update", () => {
  it("should return 200 when updating successfully", async () => {
    const response = await userRequest("put", ``, { id: userId, surname: TEST_USER.updateSurname, firstName: TEST_USER.updateFirstName });
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ userId, message: "User updated successfully" });
  });

  it("should return 400 for invalid surname and firstName", async () => {    
    const response = await userRequest("put", ``, { id: userId, surname: "x".repeat(60), firstName: "y".repeat(40) });
    expect(response.status).toBe(400);
    expect(response.body.error).toContain("Surname must be at most 25 characters long");
    expect(response.body.error).toContain("First name must be at most 25 characters long");
  });

  it("should return 404 when user not found", async () => {
    const response = await userRequest("put", ``, { id: TEST_USER.invalidUserId, surname: TEST_USER.updateSurname, firstName: TEST_USER.updateFirstName });
    expectError(response, "User not found", 404);
  });
});

describe("User API - Delete", () => {
  it("should return 200 when user deleted", async () => { 
    const response = await userRequest("delete", `/${userId}`); 
    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/User deleted/i);
  });

  it("should return 404 when deleting a non-existent user", async () => { 
    const response = await userRequest("delete", `/${TEST_USER.invalidUserId}`); 
    expect(response.status).toBe( 404); 
  });
});

/** Helpers */
 
async function userRequest(method: "get"|"post"|"put"|"delete", path: string, data?: UserRequest | AddUserRequest | string) {  
  let req =  request(global.app!)[method](`${BASE_URL}${path}`);   
  if ((method === "post" || method === "put") && data) req = req.set("Content-Type", "application/json").send(data);
  return await withAuth(req);
}
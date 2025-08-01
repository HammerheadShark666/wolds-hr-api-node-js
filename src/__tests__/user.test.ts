import request from 'supertest';
import { expectError } from '../utils/error.helper';

const username = 'testuser@hotmail.com';
const password = 'Password#1';
const invalidConfirmPassword = 'Password#2';
const validUsername = 'testuser2@hotmail.com';
const role = 'clerk';
const surname = 'Test';
const firstName = 'User';
const notFoundUsername = 'testusernotfound@hotmail.com';
const invalidUserId = '6833339ab6fc76ad4cdca645';
const updateSurname = "TestUpdate";
const updateFirstName = "UserUpdate";

let userId = '';
  
describe("User API - Add a user", () => {
  it("should return 201 and user id when user added successfully", async () => {
    const response = await postUser({ username, password, confirmPassword: password, surname, firstName, role });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("userId");
    expect(typeof response.body.userId).toBe("string");
    userId = response.body.userId;
  });

  it("should return 400 and error when username already exists", async () => {
    const response = await postUser({ username, password, confirmPassword: password, surname, firstName, role });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toContain("Username exists already");
  });

  it("should return 400 and error when password and confirmPassword don't match", async () => {
    const response = await postUser({ username: validUsername, password, confirmPassword: invalidConfirmPassword, surname, firstName, role });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    console.log(response.body);
    expect(response.body.error).toContain("Passwords do not match");
  });
});

describe("User API - Get a user by id", () => {
  it("should return 200 and user details", async () => {
    const response = await getUserById(userId);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ 
      id: userId,
      surname,
      firstName,
      role
    });
  });

  it("should return 404 when user id is empty", async () => {
    const response = await getUserById('');
    expect(response.status).toBe(404);
  });

  it("should return 404 when user id not found", async () => {
    const response = await getUserById(invalidUserId);
    expect(response.status).toBe(404);
  });
});

describe("User API - Get a user by username", () => {
  it("should return 200 and user details", async () => {
    const response = await getUserByUsername(username);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: expect.any(String),
      surname,
      firstName,
      role
    });
  });

  it("should return 404 when username is empty", async () => {
    const response = await getUserByUsername('');
    expect(response.status).toBe(404);
  });

  it("should return 404 when username not found", async () => {
    const response = await getUserByUsername(notFoundUsername);
    expect(response.status).toBe(404);
  });
});

describe("User API - Update a user", () => {
  it("should return 200 when updating successfully", async () => {
    const response = await putUser({ id: userId, surname: updateSurname, firstName: updateFirstName });
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      userId,
      message: "User updated successfully"
    });
  });

  it("should return 400 and error for invalid surname and firstName", async () => {
    const response = await putUser({
      id: userId,
      surname: "invalidSurnameinvalidSurnameinvalidSurnameinvalidSurnameinvalidSurname",
      firstName: "invalidFirstNameinvalidFirstNameinvalidFirstName"
    });
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Surname must be at most 50 characters long');
    expect(response.body.error).toContain('First name must be at most 25 characters long');
  });

  it("should return 404 and error when user not found", async () => {
    const response = await putUser({ id: invalidUserId, surname: updateSurname, firstName: updateFirstName });
    expectError(response, 'User not found', 404);
  });
});

describe("User API - Delete a user", () => {
  it("should return 200 and confirmation message when user deleted", async () => {
    const response = await deleteUserById(userId);
    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/User deleted/i);
  });

  it("should return 404 and error when deleting a user that does not exist", async () => {
    const response = await deleteUserById(invalidUserId);
    expectError(response, 'User not found', 404);
  });
});

/** Helper functions */

function postUser(data?: object) {

  if(global.ACCESS_TOKEN == null)
    throw new Error("Access token is missing");

  const req = request(global.app!)
    .post("/v1/users/add")
      .set("Cookie", [global.ACCESS_TOKEN])
      .set("Content-Type", "application/json")
      .send(data);
  
  if (data !== undefined) {
    return req.send(data);
  }
  return req.send();
}

function putUser(data?: object) {

  if(global.ACCESS_TOKEN == null)
    throw new Error("Access token is missing");

  const ressponse = request(global.app!)
    .put("/v1/users")
      .set("Cookie", [global.ACCESS_TOKEN])
      .set("Content-Type", "application/json")
      .send(data);

  return ressponse;
}

async function getUserById(id: string) {

  if(global.ACCESS_TOKEN == null)
    throw new Error("Access token is missing");

  const response = await request(global.app!)
    .get(`/v1/users/id/${id}`) 
      .set("Content-Type", "application/json")
      .set("Cookie", [global.ACCESS_TOKEN]);

  return response;
}

async function getUserByUsername(username: string) {

  if(global.ACCESS_TOKEN == null)
    throw new Error("Access token is missing");

  const response = await request(global.app!)
    .get(`/v1/users/username/${username}`) 
      .set("Content-Type", "application/json")
      .set("Cookie", [global.ACCESS_TOKEN]);

  return response;
}

async function deleteUserById(userId: string) {

  if(global.ACCESS_TOKEN == null)
    throw new Error("Access token is missing");

   const response = await request(global.app!)
        .delete(`/v1/users/${userId}`)
        .set("Cookie", [global.ACCESS_TOKEN])
        .send();

   return response;
}
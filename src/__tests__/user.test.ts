import request from 'supertest'; 
const username = 'testuser@hotmail.com';
const password = 'Password#1';
const role = 'clerk';
const surname = 'Test';
const firstName = 'User';
const invalidUsername = 'testuserinvalid.com';
const notFoundUsername = 'testusernotfound@hotmail.com';
const invalidUserId = '6833339ab6fc76ad4cdca645';
let userId = '';

describe("User API - Add a user", () => { 

  it("should return 200 and user id when user added successful ", async () => {
      
    const response = await postUser({ username, password, confirmPassword: password, surname, firstName, role: 'clerk' });
    expect(response.status).toBe(201);    
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty("userId");
    expect(typeof response.body.userId).toBe('string');   

    userId = response.body.userId; 
  }); 
  
  it("should return 400 and error when username already exists ", async () => {
    
    const response = await postUser({ username, password, confirmPassword: password, surname: 'Test', firstName: 'User', role: 'clerk' });
    expect(response.status).toBe(400);    
    expect(response.body).toBeDefined();  
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toContain("Username already exists");  
  });
});


describe("User API - Get a user by id", () => { 

  it("should return 200 and user details ", async () => {
        
    const response = await getUserById(userId); 

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty("id");
    expect(typeof response.body.id).toBe('string');  

    expect(response.body).toHaveProperty("surname");
    expect(typeof response.body.surname).toBe('string');
    expect(response.body.surname).toBe(surname);

    expect(response.body).toHaveProperty("firstName");
    expect(typeof response.body.firstName).toBe('string');  
    expect(response.body.firstName).toBe(firstName); 

    expect(response.body).toHaveProperty("role");
    expect(typeof response.body.role).toBe('string'); 
    expect(response.body.role).toBe(role);
  });

  it("should return 404 and error User not found", async () => {
    
    const response = await getUserById('');
    expect(response.status).toBe(404);
  });

  it("should return 404 and error User not found", async () => {
       
    const response = await getUserById(invalidUserId);    
    expect(response.status).toBe(404);
  });  
});

describe("User API - Get a user by username", () => { 

  it("should return 200 and user details ", async () => {
        
    const response = await getUserByUsername(username); 

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty("id");
    expect(typeof response.body.id).toBe('string');  

    expect(response.body).toHaveProperty("surname");
    expect(typeof response.body.surname).toBe('string');
    expect(response.body.surname).toBe(surname);

    expect(response.body).toHaveProperty("firstName");
    expect(typeof response.body.firstName).toBe('string');  
    expect(response.body.firstName).toBe(firstName); 

    expect(response.body).toHaveProperty("role");
    expect(typeof response.body.role).toBe('string'); 
    expect(response.body.role).toBe(role);
  });

  it("should return 404 and error User not found", async () => {
    
    const response = await getUserByUsername('');
    expect(response.status).toBe(404);
  });

  it("should return 404 and error User not found", async () => {
       
    const response = await getUserByUsername(notFoundUsername);    
    expect(response.status).toBe(404);
  });  
}); 
 

 
// describe("User API - Update a user", () => {  

//   const updateUsername = "john3@hotmail.com";
//   const updateRole = "admin";
//   const invalidRole = "test";
//   const invalidId = "6873423ab6fc23ad4cdca777";
//   const existingUsername = "john@hotmail.com";

//   it("should return 200 and department", async () => { 

//     const response = await request(global.app!)
//       .put("/v1/users")
//         .set('Authorization', `Bearer ${global.ACCESS_TOKEN}`)
//         .set("Content-Type", "application/json")
//         .send({ id: userId, username: updateUsername, role: updateRole });
 
//     expect(response.status).toBe(200);    
//     expect(response.body).toBeDefined();
//     expect(response.body).toHaveProperty("id");
//     expect(response.body).toHaveProperty("username");  
//     expect(response.body).toHaveProperty("role");  
 
//     expect(typeof response.body.id).toBe('string');  
//     expect(typeof response.body.username).toBe('string');  
//     expect(response.body.username).toBe(updateUsername);
//     expect(response.body.role).toBe(updateRole);
//   })
  
//   it("should return 400 and error Invalid role", async () => {
      
//     const response = await request(global.app!)
//       .put("/v1/users")
//         .set('Authorization', `Bearer ${global.ACCESS_TOKEN}`)
//         .set("Content-Type", "application/json")
//         .send({ id: userId, username: updateUsername, role: invalidRole });
  
//     expect(response.status).toBe(400);    
//     // expect(response.body).toHaveProperty('errors');  
//     // expect(response.body.errors).toContain('Validation failed: role: `test` is not a valid enum value for path `role`.'); 
//   });

//   it("should return 404 and error User not found", async () => {
      
//     const response = await request(global.app!)
//       .put("/v1/users")
//         .set('Authorization', `Bearer ${global.ACCESS_TOKEN}`)
//         .set("Content-Type", "application/json")
//         .send({ id: invalidId, username: updateUsername, role: updateRole });
  
//     expect(response.status).toBe(404);    
//     // expect(response.body).toHaveProperty('errors');  
//     // expect(response.body.errors).toContain('User not found'); 
//   });

//   it("should return 400 and error User with the usename already exists", async () => {
      
//     const response = await request(global.app!)
//       .put("/v1/users")
//         .set('Authorization', `Bearer ${global.ACCESS_TOKEN}`)
//         .set("Content-Type", "application/json")
//         .send({ id: userId, username: existingUsername, role: updateRole });
  
//     expect(response.status).toBe(400);    
//     // expect(response.body).toHaveProperty('errors');  
//     // expect(response.body.errors).toContain('User with the usename already exists'); 
//   }); 
// });


describe("User API - Delete a user", () => { 

   it("delete user, should return 200 and message User deleted", async () => {
   
    const response = await request(global.app!)
        .delete(`/v1/users/${userId}`)
        .set('Authorization', `Bearer ${global.ACCESS_TOKEN || ''}`)
        .send();
  
    expect(response.status).toBe(200);    
    expect(response.body).toHaveProperty('message');  
    expect(response.body.message).toMatch('User deleted'); 
  });  

  // it("delete user, should return 404 and error User not found", async () => {
   
  //   const response = await request(global.app!)
  //       .delete(`/v1/users/${invalidUserId}`)
  //       .set('Authorization', `Bearer ${global.ACCESS_TOKEN || ''}`)
  //       .send();
  
  //   expect(response.status).toBe(404);    
  //   // expect(response.body).toHaveProperty('errors');  
  //   // expect(response.body.errors).toContain('User not found'); 
  // });


});


function postUser(data?: object) {
  const req = request(global.app!)
    .post("/v1/users/add")
      .set('Authorization', `Bearer ${global.ACCESS_TOKEN}`)
      .set("Content-Type", "application/json")
      .send(data);
  
  if (data !== undefined) {
    return req.send(data);
  }
  return req.send();
}

async function getUserById(id: string) {
  const response = await request(global.app!)
    .get(`/v1/users/id/${id}`) 
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${global.ACCESS_TOKEN}`);

  return response;
}

async function getUserByUsername(username: string) {
  const response = await request(global.app!)
    .get(`/v1/users/username/${username}`) 
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${global.ACCESS_TOKEN}`);

  return response;
} 
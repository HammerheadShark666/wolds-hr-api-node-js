import request from 'supertest';
 
const username = 'testuser@hotmail.com';
const password = 'Password#1';
const role = 'user';
const invalidEmail = 'testuserinvalid.com';
const invalidUserId = '6833339ab6fc76ad4cdca645';
let userId = '';

describe("User API - Add a user", () => { 

   it("should return 200 and user id when register successful ", async () => {
      
      // const response = await request(global.app!)
      //   .post("/v1/register") 
      //     .set("Content-Type", "application/json")
      //     .send({username: username, password: password, confirmPassword: password}); 
   
      // expect(response.status).toBe(200);    
      // expect(response.body).toBeDefined();
      // expect(response.body).toHaveProperty("userId");
      // expect(typeof response.body.userId).toBe('string'); 
      // expect(response.body).toHaveProperty("message");
      // expect(response.body.message).toMatch("User registered successfully");  
  
      // userId = response.body.userId;
    }); 
  
    // it("should return 400 and error when username already exists ", async () => {
      
    //   const response = await request(global.app!)
    //     .post("/v1/register") 
    //       .set("Content-Type", "application/json")
    //       .send({username: username, password: password, confirmPassword: password}); 
   
    //   expect(response.status).toBe(400);    
    //   expect(response.body).toBeDefined();  
    //   expect(response.body).toHaveProperty("errors");
    //   expect(response.body.errors[0]).toMatch("Username already exists");  
    // });
  
    // it("delete registered user, should return 200 when deleted", async () => {
  
    //   const response = await request(global.app!)
    //       .delete(`/v1/users/${userId}`)
    //       .set('Authorization', `Bearer ${global.ACCESS_TOKEN || ''}`)
    //       .send();
    
    //   expect(response.status).toBe(200);    
    //   expect(response.body).toHaveProperty('message');  
    //   expect(response.body.message).toMatch('User deleted'); 
    // }); 


  //it("should return 200 and user details ", async () => {
      
  //   const response = await request(global.app!)
  //         .post("/v1/register") 
  //           .set("Content-Type", "application/json")
  //           .send({username: username, password: password}); 
     
  //       expect(response.body).toBeDefined();
  //       expect(response.body).toHaveProperty("userId");
  //       expect(typeof response.body.userId).toBe('string'); 
  //       expect(response.body).toHaveProperty("message");
  //       expect(response.body.message).toMatch("User registered successfully");  
    
  //       userId = response.body.userId;
  // });
//}); 

// describe("User API - Get a user by email", () => { 

//   it("should return 200 and user details ", async () => {
      
//     const response = await request(global.app!)
//       .get(`/v1/users/email/${username}`) 
//         .set("Content-Type", "application/json")
//         .set("Authorization", `Bearer ${global.ACCESS_TOKEN}`)
//         .send(); 

//     expect(response.body).toBeDefined();
//     expect(response.body).toHaveProperty("id");
//     expect(typeof response.body.id).toBe('string');  
//     expect(response.body).toHaveProperty("username");
//     expect(typeof response.body.id).toBe('string');  
//     expect(response.body).toHaveProperty("role");
//     expect(typeof response.body.id).toBe('string');  

//     expect(response.body.username).toBe(username); 
//     expect(response.body.role).toBe(role);
//   });

//   it("should return 404 and error User not found", async () => {
      
//     const response = await request(global.app!)
//       .get(`/v1/users/email/`) 
//         .set("Content-Type", "application/json")
//         .set("Authorization", `Bearer ${global.ACCESS_TOKEN}`)
//         .send();  

//     expect(response.status).toBe(404);
//   });

//   it("should return 404 and error User not found", async () => {
      
//     const response = await request(global.app!)
//       .get(`/v1/users/email/${invalidEmail}`) 
//         .set("Content-Type", "application/json")
//         .set("Authorization", `Bearer ${global.ACCESS_TOKEN}`)
//         .send(); 

//     expect(response.status).toBe(404);    
//     // expect(response.body).toHaveProperty('errors');  
//     // expect(response.body.errors[0]).toMatch('User not found'); 
//   });
// });

// describe("User API - Get a user by id", () => { 

//   it("should return 200 and user details ", async () => {
       
//     const response = await request(global.app!)
//       .get(`/v1/users/id/${userId}`) 
//         .set("Content-Type", "application/json")
//         .set("Authorization", `Bearer ${global.ACCESS_TOKEN}`)
//         .send(); 

//     expect(response.body).toBeDefined();
//     expect(response.body).toHaveProperty("id");
//     expect(typeof response.body.id).toBe('string');  
//     expect(response.body).toHaveProperty("username");
//     expect(typeof response.body.id).toBe('string');  
//     expect(response.body).toHaveProperty("role");
//     expect(typeof response.body.id).toBe('string');  

//     expect(response.body.username).toBe(username); 
//     expect(response.body.role).toBe(role);
//   });

//   it("should return 404 and error User not found", async () => {
      
//     const response = await request(global.app!)
//       .get(`/v1/users/id/`) 
//         .set("Content-Type", "application/json")
//         .set("Authorization", `Bearer ${global.ACCESS_TOKEN}`)
//         .send();  
        
//     expect(response.status).toBe(404);
//   });

//   it("should return 404 and error User not found", async () => {
      
//     const response = await request(global.app!)
//       .get(`/v1/users/id/${invalidUserId}`) 
//         .set("Content-Type", "application/json")
//         .set("Authorization", `Bearer ${global.ACCESS_TOKEN}`)
//         .send(); 

//     expect(response.status).toBe(404);    
//     // expect(response.body).toHaveProperty('errors');  
//     // expect(response.body.errors[0]).toMatch('User not found'); 
//   });
// });
 
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
//     // expect(response.body.errors[0]).toMatch('Validation failed: role: `test` is not a valid enum value for path `role`.'); 
//   });

//   it("should return 404 and error User not found", async () => {
      
//     const response = await request(global.app!)
//       .put("/v1/users")
//         .set('Authorization', `Bearer ${global.ACCESS_TOKEN}`)
//         .set("Content-Type", "application/json")
//         .send({ id: invalidId, username: updateUsername, role: updateRole });
  
//     expect(response.status).toBe(404);    
//     // expect(response.body).toHaveProperty('errors');  
//     // expect(response.body.errors[0]).toMatch('User not found'); 
//   });

//   it("should return 400 and error User with the usename already exists", async () => {
      
//     const response = await request(global.app!)
//       .put("/v1/users")
//         .set('Authorization', `Bearer ${global.ACCESS_TOKEN}`)
//         .set("Content-Type", "application/json")
//         .send({ id: userId, username: existingUsername, role: updateRole });
  
//     expect(response.status).toBe(400);    
//     // expect(response.body).toHaveProperty('errors');  
//     // expect(response.body.errors[0]).toMatch('User with the usename already exists'); 
//   }); 
// });


// describe("User API - Delete a user", () => { 

//    it("delete user, should return 200 and message User deleted", async () => {
   
//     const response = await request(global.app!)
//         .delete(`/v1/users/${userId}`)
//         .set('Authorization', `Bearer ${global.ACCESS_TOKEN || ''}`)
//         .send();
  
//     expect(response.status).toBe(200);    
//     expect(response.body).toHaveProperty('message');  
//     expect(response.body.message).toMatch('User deleted'); 
//   });  

//   it("delete user, should return 404 and error User not found", async () => {
   
//     const response = await request(global.app!)
//         .delete(`/v1/users/${invalidUserId}`)
//         .set('Authorization', `Bearer ${global.ACCESS_TOKEN || ''}`)
//         .send();
  
//     expect(response.status).toBe(404);    
//     // expect(response.body).toHaveProperty('errors');  
//     // expect(response.body.errors[0]).toMatch('User not found'); 
//   });
// 

});
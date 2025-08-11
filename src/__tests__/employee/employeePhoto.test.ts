import path from "path";
import request from 'supertest'; 
import { expectEmployee } from "./employeeExpectedHelper";
import { EmployeeRequest } from "../../interface/employee";
import fs from 'fs';

let employeeId = ""; 

const EMPLOYEE_SURNAME = "Jones";
const EMPLOYEE_FIRST_NAME = "Mandy";
const EMPLOYEE_DOB = new Date("05-23-2000");
const EMPLOYEE_HIRE_DATE = new Date("03-11-2021");
const EMPLOYEE_EMAIL = "test@hotmail.com";
const EMPLOYEE_PHONE_NUMBER = "0177563423"; 
const EMPLOYEE_DEPARTMENT_ID = "687783fbb6fc23ad4cdca63e"; 

beforeAll(async () => { 
  
  const response = await postEmployee({ surname: EMPLOYEE_SURNAME, firstName: EMPLOYEE_FIRST_NAME, 
                                        dateOfBirth: EMPLOYEE_DOB, hireDate: EMPLOYEE_HIRE_DATE, email: EMPLOYEE_EMAIL, 
                                        phoneNumber: EMPLOYEE_PHONE_NUMBER, departmentId: EMPLOYEE_DEPARTMENT_ID });
    
  expectEmployee(response.body, { expectedSurname: EMPLOYEE_SURNAME, expectedFirstName: EMPLOYEE_FIRST_NAME, expectedDateOfBirth: EMPLOYEE_DOB, 
                                  expectedHireDate: EMPLOYEE_HIRE_DATE, expectedEmail: EMPLOYEE_EMAIL, expectedPhoneNumber: EMPLOYEE_PHONE_NUMBER, 
                                  expectedDepartmentId: EMPLOYEE_DEPARTMENT_ID });

  employeeId = response.body.id;
});

// afterAll(async () => {  
//   const res = await deleteEmployee(employeeId);
//   expect(res.status).toBe(200);
//   expect(res.body.message).toMatch('Employee deleted');
// });



describe('Employee Photo Upload (In-Memory)', () => {
  it('should upload a file successfully', async () => {
    const filePath = path.join(__dirname, '../files', 'Employee1.jpg'); // must exist

    if(global.ACCESS_TOKEN == null)
      throw new Error("Access token is missing");

    const id = "689a1353fbc8da75613e60a0"

    const res = await request(global.app!)
      .post(`/v1/employees/photo/upload/${id}`)
      .set("Cookie", [global.ACCESS_TOKEN])
      .attach('photoFile', filePath);

    expect(res.status).toBe(200);
    
    
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    // Extract name and extension
    const [name, ext] = res.body.filename.split('.');

    expect(ext).toBe('jpg');
    expect(uuidRegex.test(name)).toBe(true);

    expect(res.body.id).toBe(id);

  });

  // it('should return 400 if no file uploaded', async () => {
  //   const res = await request(global.app!)
  //     .post('/v1/employees/photo/upload');

  //   expect(res.status).toBe(400);
  //   expect(res.body.error).toBe('No file uploaded');
  // });
});



// describe('POST GET /api/v1/employees/upload-photo/:id', () => {
//   it('should upload a file and return URL', async () => {

//     //const filePath = path.join(__dirname, 'Employee1.jpg'); // place a small test image here

//     const filePath = path.join(__dirname, '..', 'files'); //, 'Employee1.jpg'

//     if (!fs.existsSync(filePath)) {
//       throw new Error(`File not found at path: ${filePath}`);
//     }

//     console.log("filePath =  ", filePath);

//    // const response = await postEmployeePhoto(filePath, employeeId);

//     const response = await request(global.app!)
//         .post('/v1/employees/photo/upload')
//         .attach('photoFile', filePath, 'Employee1.jpg')
//         .expect(200);
 
//     expect(response.status).toBe(200); 
//     expect(response.body).toHaveProperty('filename');
//     expect(typeof response.body.filename).toBe('string');
//     expect(response.body.filename.length).toBeGreaterThan(0);
//     expect(response.body).toHaveProperty('id');
//     expect(typeof response.body.id).toBe('string');
//     expect(response.body.id).toEqual(employeeId);
//   });

  // it('should return 400 if no file uploaded', async () => {
  //   const res = await request(app)
  //     .post('/upload')
  //     .expect(400);

  //   expect(res.text).toBe('No file uploaded');
  // });
//});

function postEmployeePhoto(filePath: string, id: string) {
 
  if(global.ACCESS_TOKEN == null)
    throw new Error("Access token is missing");

  console.log("PostEmployeePhoto")
  console.log("filePath = ", filePath)
  console.log("id = ", id)


  return request(global.app!)
    .post(`/v1/employees/photo/upload`)
    //  .set("Cookie", [global.ACCESS_TOKEN])
      .attach('photoFile', filePath, 'Employee1.jpg');   
}

function postEmployee(data?: EmployeeRequest) {
 
  if(global.ACCESS_TOKEN == null)
    throw new Error("Access token is missing");

  const req = request(global.app!)
    .post("/v1/employees")
      .set("Cookie", [global.ACCESS_TOKEN])
      .set("Content-Type", "application/json");
  
  if (data !== undefined) {
    return req.send(data);
  }
  return req.send();
}
  
function deleteEmployee(id: string) {

  if(global.ACCESS_TOKEN == null)
    throw new Error("Access token is missing");

  const req = request(global.app!)
    .delete("/v1/employees/" + id)
      .set("Cookie", [global.ACCESS_TOKEN])
      .set("Content-Type", "application/json");
   
  return req.send();
}
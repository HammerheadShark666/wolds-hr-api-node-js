import { AUTHENTICATION_ERRORS } from "../../../utils/constants";
import request from 'supertest';

export async function getDepartmentsAsync() {

  if(global.ACCESS_TOKEN == null)
    throw new Error(AUTHENTICATION_ERRORS.ACCESS_TOKEN_MISSING);

  const req = await request(global.app!)
    .get("/v1/departments")
    .set("Cookie", [global.ACCESS_TOKEN]);

  return req
}

export async function getDepartmentByNameAsync(name: string) {

  if(global.ACCESS_TOKEN == null)
    throw new Error(AUTHENTICATION_ERRORS.ACCESS_TOKEN_MISSING);

  const req = await request(global.app!)
    .get(`/v1/departments/name/${name}`)
    .set("Cookie", [global.ACCESS_TOKEN]); 

  return req.body.id;
}

export function postDepartment(data?: object) {

  if(global.ACCESS_TOKEN == null)
    throw new Error("Access token is missing");

  const req = request(global.app!)
    .post("/v1/departments")
      .set("Cookie", [global.ACCESS_TOKEN])
      .set("Content-Type", "application/json");
  
  if (data !== undefined) {
    return req.send(data);
  }
  return req.send();
}
  
export function putDepartment(departmentId: string, data: string) {

  if(global.ACCESS_TOKEN == null)
    throw new Error("Access token is missing");

  return request(global.app!)
    .put(`/v1/departments/${departmentId}`)
      .set("Cookie", [global.ACCESS_TOKEN])
      .set('Content-Type', 'application/json')
      .send({ name: data });
}

export function deleteDepartment(id: string) {

   if(global.ACCESS_TOKEN == null)
    throw new Error("Access token is missing");

  return request(global.app!)
    .delete(`/v1/departments/${id}`)
      .set("Cookie", [global.ACCESS_TOKEN]);
}

export function getDepartmentById(departmentId: string) {

   if(global.ACCESS_TOKEN == null)
    throw new Error("Access token is missing");

  return request(global.app!)
    .get(`/v1/departments/${departmentId}`)
      .set("Cookie", [global.ACCESS_TOKEN]) 
      .set('Content-Type', 'application/json');
}   
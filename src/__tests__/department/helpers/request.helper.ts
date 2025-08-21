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
    .get("/v1/departments/name/" + name)
    .set("Cookie", [global.ACCESS_TOKEN]);

  console.log("req - ", req.body)

  return req.body.id;
}
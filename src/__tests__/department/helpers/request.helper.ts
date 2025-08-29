import request, { Response } from "supertest"; 
import { withAuth } from "../../utils/request.helper";
 
// ---- API Calls ----

export async function getDepartmentsAsync(): Promise<Response> {
  return withAuth(request(global.app!).get("/v1/departments"));
}

export async function getDepartmentByNameAsync(name: string): Promise<string> {
  const res = await withAuth(
    request(global.app!).get(`/v1/departments/name/${name}`)
  );
  return res.body.id;
}

export function postDepartment(data?: object): Promise<Response> {
  let req = withAuth(
    request(global.app!).post("/v1/departments").set("Content-Type", "application/json")
  );
  if (data) {
    req = req.send(data);
  }
  return req;
}

export function putDepartment(departmentId: string, data: string): Promise<Response> {
  return withAuth(
    request(global.app!)
      .put(`/v1/departments/${departmentId}`)
      .set("Content-Type", "application/json")
      .send({ name: data })
  );
}

export function deleteDepartment(id: string): Promise<Response> {
  return withAuth(request(global.app!).delete(`/v1/departments/${id}`));
}

export function getDepartmentById(departmentId: string): Promise<Response> {
  return withAuth(request(global.app!).get(`/v1/departments/${departmentId}`));
}
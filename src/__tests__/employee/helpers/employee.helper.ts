// test/helpers/employee.helper.ts
import request from "supertest";
import { AUTHENTICATION_ERRORS, PAGE_SIZE } from "../../../utils/constants";
import { EmployeeRequest } from "../../../interface/employee";
 
const BASE_URL = "/v1/employees";

export async function employeeRequest(method: "get"|"post"|"put"|"delete", path: string, data?: EmployeeRequest | string) {
  if (!global.ACCESS_TOKEN) throw new Error(AUTHENTICATION_ERRORS.ACCESS_TOKEN_MISSING);

  let req = request(global.app!)[method](`${BASE_URL}${path}`).set("Cookie", [global.ACCESS_TOKEN]);

  if (method === "post" || method === "put") req = req.set("Content-Type", "application/json").send(data);
  return req;
}

export const postEmployee = (data?: EmployeeRequest) => employeeRequest("post", "", data);
export const putEmployee = (id: string, data?: EmployeeRequest) => employeeRequest("put", `/${id}`, data);
export const getEmployee = (id: string) => employeeRequest("get", `/${id}`);
export const deleteEmployee = (id: string) => employeeRequest("delete", `/${id}`);
export const searchEmployees = (params: { keyword?: string, departmentId?: string, page?: number, pageSize?: number }) => {
  const query = new URLSearchParams({
    keyword: params.keyword || "",
    departmentId: params.departmentId || "",
    page: String(params.page || 1),
    pageSize: String(params.pageSize || PAGE_SIZE)
  });
  return employeeRequest("get", `/search?${query.toString()}`);
};

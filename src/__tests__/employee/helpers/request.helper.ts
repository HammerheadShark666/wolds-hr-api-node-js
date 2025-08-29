import request, { SuperTest, Test } from "supertest";
import { EmployeeRequest } from "../../../interface/employee";
import { AUTHENTICATION_ERRORS, PAGE_SIZE } from "../../../utils/constants";
import { withAuth } from "../../utils/request.helper";

const baseUrl = "/v1/employees";
 
export async function postEmployeeAsync(data?: EmployeeRequest) {
  return withAuth(
    request(global.app!)
      .post(baseUrl)
      .set("Content-Type", "application/json")
      .send(data ?? {})
  );
}

export async function deleteEmployeeAsync(id: string) {
  return withAuth(
    request(global.app!)
      .delete(`${baseUrl}/${id}`)
      .set("Content-Type", "application/json")
  );
}

export async function getEmployeeAsync(id: string) {
  return withAuth(
    request(global.app!)
      .get(`${baseUrl}/${id}`)
      .set("Content-Type", "application/json")
  );
}

export async function postEmployeePhotoAsync(filePath: string, id: string) {
  return withAuth(
    request(global.app!)
      .post(`${baseUrl}/photo/upload/${id}`)
      .attach("photoFile", filePath)
  );
}

export type SearchEmployeesParams = {
  keyword?: string;
  departmentId?: string;
  page?: number;
  pageSize?: number;
};

export async function getSearchEmployeesAsync(params: SearchEmployeesParams = {}) {
  const {
    keyword = "",
    departmentId = "",
    page = 1,
    pageSize = PAGE_SIZE,
  } = params;

  return withAuth(
    request(global.app!).get(
      `${baseUrl}/search?keyword=${keyword}&departmentId=${departmentId}&page=${page}&pageSize=${pageSize}`
    )
  );
}

export async function putEmployeeAsync(id: string, data: EmployeeRequest) {
  return withAuth(
    request(global.app!)
      .put(`${baseUrl}/${id}`)
      .set("Content-Type", "application/json")
      .send(data)
  );
}
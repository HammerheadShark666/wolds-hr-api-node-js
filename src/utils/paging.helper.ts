import { PAGE_SIZE } from "./constants";

export function validatePagination(page: number, pageSize: number): [number, number]{
 
  let validPage = Number(page);
  let validPageSize = Number(pageSize);
 
  if (Number.isNaN(validPage) || validPage < 1) {
    validPage = 1;
  } 

  const DEFAULT_PAGE_SIZE = PAGE_SIZE;
  const MAX_PAGE_SIZE = 150;
  if (Number.isNaN(validPageSize ) || validPageSize  < 1 || validPageSize > MAX_PAGE_SIZE) {
    validPageSize  = DEFAULT_PAGE_SIZE;
  } 
  return  [validPage, validPageSize];
}
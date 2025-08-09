import { Types } from 'mongoose'; 
import { EmployeeModel, IEmployee } from '../models/employee.model';
import { EmployeeSearchResponse, EmployeeSearchRequest, EmployeeSearchPagedResponse, AddEmployeeRequest, AddEmployeeResponse } from '../interface/employee';
import { toEmployeeSearchResponse } from '../utils/mapper'; 
import { validate } from '../validation/validate';
import { ServiceResult } from '../types/ServiceResult';
import { employeeSearchSchema } from '../validation/employee/employeeSearch.schema';
import { handleServiceError } from '../utils/error.helper';
import { addEmployeeSchema } from '../validation/employee/addEmployee.schema';
import { departmentExistsAsync } from './department.service';
import { deleteDepartmentSchema } from '../validation/department/deleteDepartment.schema';

const PAGE_SIZE = 5;

//Service export functions

export async function searchEmployeesPagedAsync(query: EmployeeSearchRequest): Promise<ServiceResult<EmployeeSearchPagedResponse>> {

  const { keyword, departmentId } = query;   

  const validationResult = await validate(employeeSearchSchema, { keyword, departmentId });  
  if (!validationResult.success) {
    return { success: false, code: 400, error: validationResult.error }
  }   

  let page = Number.isNaN(Number(query.page)) ? 1 : Number(query.page);  
  let pageSize = Number.isNaN(Number(query.pageSize)) ? PAGE_SIZE : Number(query.pageSize);
  
  [page, pageSize] = validatePagination(page, pageSize); 
 
  const [totalEmployees, employees] = await Promise.all([
    countEmployeesAsync(keyword, departmentId),
    searchEmployeesAsync({ keyword, departmentId, page, pageSize }).then(r => r.data ?? [])
  ]); 

   return { success: true, data: {
    page,
    pageSize,
    totalEmployees,
    totalPages: Math.ceil(totalEmployees / pageSize),
    employees: employees.map(toEmployeeSearchResponse),
    success: true
  }}; 
} 

export async function addEmployeeAsync(data: AddEmployeeRequest): Promise<ServiceResult<AddEmployeeResponse>> {
     
  const validationResult = await validate(addEmployeeSchema, data);  
  if (!validationResult.success) {
    return { success: false, code: 400, error: validationResult.error }
  }   
  
  try {  
 
    if(data.departmentId != undefined ) {
      if (!(await departmentExistsAsync(data.departmentId))) {
        return {success: false, code: 404, error: ['Department not found']};
      }
    } 

    const employee = new EmployeeModel(data);
    const saved = await employee.save();   
    return { success: true, data: toEmployeeSearchResponse(saved) };
  } 
  catch (err: unknown) {  
    return handleServiceError(err); 
  }
} 

export async function deleteEmployeeAsync(id: string): Promise<ServiceResult<null>> {
  
  const validationResult = await validate(deleteDepartmentSchema, { id });  
  if (!validationResult.success) {
    return { success: false, code: 400, error: validationResult.error }
  } 

  try { 

    if (!(await employeeExistsAsync(id))) { 
      return {success: false, code: 404, error: ['Department not found']};
    }   
 
    await EmployeeModel.findByIdAndDelete(id); 

    return { success: true, data: null };
  } 
  catch (err: unknown) { 
    return handleServiceError(err);
  }
}

export async function employeeExistsAsync(id: string): Promise<boolean> {
  const exists = await EmployeeModel.exists({ _id: id }).exec(); 
  return !!exists;
}

//Service helper functions

async function searchEmployeesAsync(query: EmployeeSearchRequest): Promise<EmployeeSearchResponse> {
  try { 
    const pipeline = buildEmployeeSearchPipeline(query);
    const result = await EmployeeModel.aggregate(pipeline);
    return { success: true, data: result };
  } catch (err) { 
    return {
      success: false,
      error: 'Failed to search employees.',
    };
  }
}  

async function countEmployeesAsync(keyword?: string, departmentId?: string): Promise<number> {
  try{
    const filter: any = {};

    if (keyword?.trim()) {
      filter.surname = { $regex: `^${keyword.trim()}`, $options: 'i' };
    }

    if (departmentId && Types.ObjectId.isValid(departmentId)) {
      filter.departmentId = new Types.ObjectId(departmentId);
    }

    return EmployeeModel.countDocuments(filter);
  } catch (err) { 
    return 0;
  }
}

function parsePagination(query: EmployeeSearchRequest, defaults = { page: 1, pageSize: PAGE_SIZE }) {
  const page = typeof query.page === 'number' ? query.page : parseInt(query.page ?? '', PAGE_SIZE) || defaults.page;
  const pageSize = typeof query.pageSize === 'number' ? query.pageSize : parseInt(query.pageSize ?? '', 10) || defaults.pageSize;    
  return { page, pageSize };
}

//Service Pipelines

function buildEmployeeSearchPipeline(query: EmployeeSearchRequest): any[] {
  const pipeline: any[] = [
    {
      $lookup: {
        from: 'departments',
        localField: 'departmentId',
        foreignField: '_id',
        as: 'department',
      },
    },
    {
      $unwind: {
        path: '$department',
        preserveNullAndEmptyArrays: true,
      },
    },
  ];

  if (query.keyword?.trim()) {
    pipeline.push({
      $match: {
        surname: {
          $regex: `^${query.keyword.trim()}`,
          $options: 'i',
        },
      },
    });
  }

  if (query.departmentId && Types.ObjectId.isValid(query.departmentId)) {
    pipeline.push({
      $match: {
        departmentId: new Types.ObjectId(query.departmentId),
      },
    });
  }
 
  const { page, pageSize } = parsePagination(query);
  pipeline.push(
    { $sort: { surname: 1, firstName: 1 } },
    { $skip: (page - 1) * pageSize },
    { $limit: pageSize }
  );

  return pipeline;
}
 

//Service Validation 

function validatePagination(page: number, pageSize: number): [number, number]{
 
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
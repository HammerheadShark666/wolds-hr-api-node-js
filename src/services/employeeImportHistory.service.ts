import { Types } from "mongoose";
import { EmployeeImportHistoryPagedResponse, EmployeeImportHistoryRequest, EmployeeImportHistoryResponse } from "../interface/employee";
import { ServiceResult } from "../types/ServiceResult";
import { PAGE_SIZE } from "../utils/constants";
import { toEmployeeResponse } from "../utils/mapper";
import { validatePagination } from "../utils/paging.helper";
import { EmployeeModel } from "../models/employee.model";
import { ObjectId } from "mongodb";


export async function employeesImportedPagedAsync(query: EmployeeImportHistoryRequest): Promise<ServiceResult<EmployeeImportHistoryPagedResponse>> {

  const { employeeImportId } = query;   
  
    // const validationResult = await validate(employeeSearchSchema, { keyword, departmentId });  
    // if (!validationResult.success) {
    //   return { success: false, code: 400, error: validationResult.error }
    // }   
  
    let page = Number.isNaN(Number(query.page)) ? 1 : Number(query.page);  
    let pageSize = Number.isNaN(Number(query.pageSize)) ? PAGE_SIZE : Number(query.pageSize);
    
    [page, pageSize] = validatePagination(page, pageSize); 
   
    const [totalEmployees, employees] = await Promise.all([
      countImportedEmployeesAsync(employeeImportId),
      getImportedEmployeesAsync(query).then(r => r.data ?? [])
    ]); 
  
     return { success: true, data: {
      page,
      pageSize,
      totalEmployees,
      totalPages: Math.ceil(totalEmployees / pageSize),
      employees: employees.map(toEmployeeResponse),
      success: true
    }}; 
}

async function getImportedEmployeesAsync(query: EmployeeImportHistoryRequest): Promise<EmployeeImportHistoryResponse> {
  try { 
    const pipeline = buildEmployeeSearchPipeline(query);
    const response = await EmployeeModel.aggregate(pipeline);
    return { success: true, data: response };
  } catch (err) { 
    return {
      success: false,
      error: 'Failed to search employees.',
    };
  }
}  

async function countImportedEmployeesAsync(employeeImportId: Types.ObjectId): Promise<number> {
  try {    
    return EmployeeModel.countDocuments({employeeImportId: employeeImportId});
  } catch (err) { 
    return 0;
  }
} 
 

function buildEmployeeSearchPipeline(query: EmployeeImportHistoryRequest): any[] {
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

  if (query.employeeImportId) {
    pipeline.push({
      $match: { employeeImportId: new ObjectId(query.employeeImportId) }
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

function parsePagination(query: EmployeeImportHistoryRequest, defaults = { page: 1, pageSize: PAGE_SIZE }) {
  const page = typeof query.page === 'number' ? query.page : parseInt(query.page ?? '', PAGE_SIZE) || defaults.page;
  const pageSize = typeof query.pageSize === 'number' ? query.pageSize : parseInt(query.pageSize ?? '', 10) || defaults.pageSize;    
  return { page, pageSize };
}
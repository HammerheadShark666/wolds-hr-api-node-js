import mongoose, { Types } from "mongoose";
import { EmployeeImportErrorHistoryPagedResponse, EmployeeImportErrorHistoryResponse, EmployeeImportHistoryPagedResponse, EmployeeImportHistoryRequest, EmployeeImportHistoryResponse, EmployeesImportedHistoryResponse, EmployeesImportHistoryResponse } from "../interface/employee";
import { ServiceResult } from "../types/ServiceResult";
import { PAGE_SIZE } from "../utils/constants";
import { toEmployeeResponse, toEmployeesImportHistoryResponse } from "../utils/mapper";
import { validatePagination } from "../utils/paging.helper";
import { EmployeeModel } from "../models/employee.model";
import { ObjectId } from "mongodb";
import { handleServiceError } from "../utils/error.helper";
import { objectIdSchema } from "../validation/fields/objectId.schema";
import { validate } from "../validation/validate";
import { ImportedExistingEmployeeModel } from "../models/importedExistingEmployee..model";
import { ImportedEmployeeErrorModel } from "../models/importedEmployeeError.model";
import { ImportedEmployeeModel } from "../models/importedEmployee.model";





export async function employeesImportedHistoryAsync(): Promise<ServiceResult<EmployeesImportedHistoryResponse>> {
   
  try {  

    const response = await ImportedEmployeeModel.find();  

    return { success: true, data: { employeeImportHistory: toEmployeesImportHistoryResponse(response)} };
  } 
  catch (err: unknown) { 
    return handleServiceError(err);
  }
} 


export async function employeesImportedPagedAsync(query: EmployeeImportHistoryRequest): Promise<ServiceResult<EmployeeImportHistoryPagedResponse>> {

  const { id } = query;
  
    const validationResult = await validate(objectIdSchema, id);  
    if (!validationResult.success) {
      return { success: false, code: 400, error: validationResult.error }
    }   
  
    let page = Number.isNaN(Number(query.page)) ? 1 : Number(query.page);  
    let pageSize = Number.isNaN(Number(query.pageSize)) ? PAGE_SIZE : Number(query.pageSize);
    
    [page, pageSize] = validatePagination(page, pageSize); 
   
    const [totalEmployees, employees] = await Promise.all([
      countImportedEmployeesAsync(id),
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

export async function employeesImportedExistingPagedAsync(query: EmployeeImportHistoryRequest): Promise<ServiceResult<EmployeeImportHistoryPagedResponse>> {

  const { id } = query;   
  
    const validationResult = await validate(objectIdSchema, id);  
    if (!validationResult.success) {
      return { success: false, code: 400, error: validationResult.error }
    }   
  
    let page = Number.isNaN(Number(query.page)) ? 1 : Number(query.page);  
    let pageSize = Number.isNaN(Number(query.pageSize)) ? PAGE_SIZE : Number(query.pageSize);
    
    [page, pageSize] = validatePagination(page, pageSize); 
   
    const [totalEmployees, employees] = await Promise.all([
      countImportedExistingEmployeesAsync(id),
      getImportedExistingEmployeesAsync(query).then(r => r.data ?? [])
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


export async function employeesImportedErrorPagedAsync(query: EmployeeImportHistoryRequest): Promise<ServiceResult<EmployeeImportErrorHistoryPagedResponse>> {

  const { id } = query;   
  
    const validationResult = await validate(objectIdSchema, id);  
    if (!validationResult.success) {
      return { success: false, code: 400, error: validationResult.error }
    }   
  
    let page = Number.isNaN(Number(query.page)) ? 1 : Number(query.page);  
    let pageSize = Number.isNaN(Number(query.pageSize)) ? PAGE_SIZE : Number(query.pageSize);
    
    [page, pageSize] = validatePagination(page, pageSize); 
   
    const [totalEmployees, employees] = await Promise.all([
      countImportedErrorEmployeesAsync(id),
      getImportedErrorEmployeesAsync(query).then(r => r.data ?? [])
    ]); 
  
     return { success: true, data: {
      page,
      pageSize,
      totalEmployees,
      totalPages: Math.ceil(totalEmployees / pageSize),
      employees: employees,
      success: true
    }}; 
} 
 
export async function deleteEmployeeImportedHistoryAsync(id: string): Promise<ServiceResult<null>> {
  
  const session = await mongoose.startSession();
  session.startTransaction();

  try { 
    await ImportedEmployeeModel.deleteOne({ _id: new Types.ObjectId(id) }); 
    await EmployeeModel.deleteMany({ employeeImportId: new Types.ObjectId(id) }); 
    await ImportedExistingEmployeeModel.deleteMany({ employeeImportId: new Types.ObjectId(id) }); 
    await ImportedEmployeeErrorModel.deleteMany({ employeeImportId: new Types.ObjectId(id) }); 

    await session.commitTransaction();
    return { success: true, data: null  };
  } catch (err) { 
    await session.abortTransaction();
    console.log(err)
    return handleServiceError(err);
  } finally {
    session.endSession();
  }
}  
 
async function getImportedEmployeesAsync(query: EmployeeImportHistoryRequest): Promise<EmployeesImportHistoryResponse> {
  try { 
    const pipeline = buildEmployeeSearchPipeline(query);
    const response = await EmployeeModel.aggregate(pipeline);
    return { success: true, data: response };
  } catch (err) { 
    return {
      success: false,
      error: 'Failed to imported employees.',
    };
  }
}  

async function getImportedExistingEmployeesAsync(query: EmployeeImportHistoryRequest): Promise<EmployeesImportHistoryResponse> {
  try { 
    const pipeline = buildEmployeeSearchPipeline(query);
    const response = await ImportedExistingEmployeeModel.aggregate(pipeline);
    return { success: true, data: response };
  } catch (err) { 
    return {
      success: false,
      error: 'Failed to imported existing employees.',
    };
  }
}  

async function getImportedErrorEmployeesAsync(query: EmployeeImportHistoryRequest): Promise<EmployeeImportErrorHistoryResponse> {
  try { 
    const pipeline = buildImportedEmployeeErrorSearchPipeline(query);
    const response = await ImportedEmployeeErrorModel.aggregate(pipeline);
 
    return { success: true, data: response };
  } catch (err) { 
    return {
      success: false,
      error: 'Failed to find imported error employees.',
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

async function countImportedExistingEmployeesAsync(employeeImportId: Types.ObjectId): Promise<number> {
  try {    
    return ImportedExistingEmployeeModel.countDocuments({employeeImportId: employeeImportId});
  } catch (err) { 
    return 0;
  }
} 

async function countImportedErrorEmployeesAsync(employeeImportId: Types.ObjectId): Promise<number> {
  try {    
    return ImportedEmployeeErrorModel.countDocuments({employeeImportId: employeeImportId});
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

  if (query.id) {
    pipeline.push({
      $match: { employeeImportId: new ObjectId(query.id) }
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

function buildImportedEmployeeErrorSearchPipeline(query: EmployeeImportHistoryRequest): any[] {
  const pipeline: any[] = [
    // {
    //   $lookup: {
    //     from: 'departments',
    //     localField: 'departmentId',
    //     foreignField: '_id',
    //     as: 'department',
    //   },
    // },
    // {
    //   $unwind: {
    //     path: '$department',
    //     preserveNullAndEmptyArrays: true,
    //   },
    // },
  ];

  if (query.id) {
    pipeline.push({
      $match: { employeeImportId: new ObjectId(query.id) }
    });
  } 
 
  const { page, pageSize } = parsePagination(query);
  pipeline.push(
   // { $sort: { surname: 1, firstName: 1 } },
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
import mongoose, { PipelineStage, Types } from "mongoose";
import { ServiceResult } from "../types/ServiceResult";
import { PAGE_SIZE } from "../utils/constants";
import { toEmployeeResponse, toEmployeesImportHistoryResponse } from "../utils/mapper";
import { validatePagination } from "../utils/paging.helper";
import { EmployeeModel, IEmployee } from "../models/employee.model";
import { ObjectId } from "mongodb";
import { handleServiceError } from "../utils/error.helper";
import { objectIdSchema } from "../validation/fields/objectId.schema";
import { validate } from "../validation/validate";
import { ImportedEmployeeExistingModel } from "../models/importedEmployeeExisting.model";
import { ImportedEmployeeErrorModel } from "../models/importedEmployeeError.model";
import { ImportedEmployeeHistoryModel } from "../models/importedEmployeeHistory.model";
import { ImportedEmployeesHistoryRequest, ImportedEmployeeHistory, ImportedEmployeesErrorHistoryPagedResponse, ImportedEmployeeError, ImportedEmployeesHistoryPagedResponse, LastEmployeeImportResponse } from "../interface/importEmployeeHistory";
 
export async function importedEmployeesHistoryAsync(): Promise<ServiceResult<ImportedEmployeeHistory[]>> { 
   
  try {  

    const response = await ImportedEmployeeHistoryModel.find().sort({ date: -1 }); 
    return { success: true, data: toEmployeesImportHistoryResponse(response) };  
  } 
  catch (err: unknown) { 
    return handleServiceError(err);
  }
}

export async function importedEmployeesPagedAsync(query: ImportedEmployeesHistoryRequest): Promise<ServiceResult<ImportedEmployeesHistoryPagedResponse>> {

  const { id } = query;
  
    const validationResult = await validate(objectIdSchema, id);  
    if (!validationResult.success) {
      return { success: false, code: 400, error: validationResult.error }
    }   
  
    let page = Number.isNaN(Number(query.page)) ? 1 : Number(query.page);  
    let pageSize = Number.isNaN(Number(query.pageSize)) ? PAGE_SIZE : Number(query.pageSize);
    
    [page, pageSize] = validatePagination(page, pageSize); 
   
    const [totalEmployees, employeesResult] = await Promise.all([
      countImportedEmployeesAsync(id),
      getImportedEmployeesAsync(query)
    ]); 

    if (!employeesResult.success) {
      return {
        success: false,
        code: 500,
        error: employeesResult.error ?? ['Failed to fetch imported employees history']
      };
    }
 
    return { success: true, data: {
      page,
      pageSize,
      totalEmployees,
      totalPages: Math.ceil(totalEmployees / pageSize),
      employees: employeesResult.data.map(toEmployeeResponse)
    }}; 
}

export async function importedEmployeesExistingPagedAsync(query: ImportedEmployeesHistoryRequest): Promise<ServiceResult<ImportedEmployeesHistoryPagedResponse>> {

  const { id } = query;   
  
    const validationResult = await validate(objectIdSchema, id);  
    if (!validationResult.success) {
      return { success: false, code: 400, error: validationResult.error }
    }   
  
    let page = Number.isNaN(Number(query.page)) ? 1 : Number(query.page);  
    let pageSize = Number.isNaN(Number(query.pageSize)) ? PAGE_SIZE : Number(query.pageSize);
    
    [page, pageSize] = validatePagination(page, pageSize); 
   
    const [totalEmployees, employeesResult] = await Promise.all([
      countImportedEmployeesExistingAsync(id),
      getImportedEmployeesExistingAsync(query)
    ]); 

    if (!employeesResult.success) {
      return {
        success: false,
        code: 500,
        error: employeesResult.error ?? ['Failed to fetch imported employees existing history']
      };
    }
  
    return { success: true, data: {
      page,
      pageSize,
      totalEmployees,
      totalPages: Math.ceil(totalEmployees / pageSize),
      employees: employeesResult.data.map(toEmployeeResponse)
    }}; 
} 

export async function importedEmployeesErrorPagedAsync(query: ImportedEmployeesHistoryRequest): Promise<ServiceResult<ImportedEmployeesErrorHistoryPagedResponse>> {

  const { id } = query;   
  
    const validationResult = await validate(objectIdSchema, id);  
    if (!validationResult.success) {
      return { success: false, code: 400, error: validationResult.error }
    }   
  
    let page = Number.isNaN(Number(query.page)) ? 1 : Number(query.page);  
    let pageSize = Number.isNaN(Number(query.pageSize)) ? PAGE_SIZE : Number(query.pageSize);
    
    [page, pageSize] = validatePagination(page, pageSize); 
   
    const [totalEmployees, employeesResult] = await Promise.all([
      countImportedEmployeesErrorAsync(id),
      getImportedEmployeesErrorAsync(query)
    ]); 

    if (!employeesResult.success) {
      return {
        success: false,
        code: 500,
        error: employeesResult.error ?? ['Failed to fetch imported employees error history']
      };
    } 
  
    return { success: true, data: {
      page,
      pageSize,
      totalEmployees,
      totalPages: Math.ceil(totalEmployees / pageSize),
      employees: employeesResult.data, 
    }}; 
} 
 

export async function getLastEmployeeImports(): Promise<ServiceResult<LastEmployeeImportResponse[]>>{
  
  try {
    const result: LastEmployeeImportResponse[] = await ImportedEmployeeHistoryModel.aggregate(buildLastEmployeeImportsPipeline(5)).exec(); 
    return { success: true, data: result };
  } catch (error: any) {
    return {
      success: false,  
      code: 500,
      error: error.message || "Failed to fetch last employee imports",
    };
  }
}

export async function deleteImportedEmployeeHistoryAsync(id: string): Promise<ServiceResult<null>> {
  
  const session = await mongoose.startSession();
  session.startTransaction();

  try { 
    await ImportedEmployeeHistoryModel.deleteOne({ _id: new Types.ObjectId(id) }); 
    await EmployeeModel.deleteMany({ importEmployeesId: new Types.ObjectId(id) }); 
    await ImportedEmployeeExistingModel.deleteMany({ importEmployeesId: new Types.ObjectId(id) }); 
    await ImportedEmployeeErrorModel.deleteMany({ importEmployeesId: new Types.ObjectId(id) }); 

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
 
async function getImportedEmployeesAsync(query: ImportedEmployeesHistoryRequest): Promise<ServiceResult<IEmployee[]>> {
  try { 
    const pipeline = buildEmployeeSearchPipeline(query);
    const response = await EmployeeModel.aggregate(pipeline);
    return { success: true, data: response };
  } catch (err) { 
    return {
      success: false,
      error: ['Failed to imported employees.'],
    };
  }
}  

async function getImportedEmployeesExistingAsync(query: ImportedEmployeesHistoryRequest): Promise<ServiceResult<IEmployee[]>> {
  try { 
    const pipeline = buildEmployeeSearchPipeline(query);
    const response = await ImportedEmployeeExistingModel.aggregate(pipeline);
    return { success: true, data: response };
  } catch (err) { 
    return {
      success: false,
      error: ['Failed to imported existing employees.'],
    };
  }
}  

async function getImportedEmployeesErrorAsync(query: ImportedEmployeesHistoryRequest): Promise<ServiceResult<ImportedEmployeeError[]>> {
  try { 
    const pipeline = buildImportedEmployeeErrorSearchPipeline(query);
    const response = await ImportedEmployeeErrorModel.aggregate(pipeline);
 
    return { success: true, data: response };
  } catch (err) { 
    return {
      success: false,
      error: ['Failed to find imported error employees.'],
    };
  }
}   

async function countImportedEmployeesAsync(importEmployeesId: Types.ObjectId): Promise<number> {
  try {    
    return EmployeeModel.countDocuments({importEmployeesId: importEmployeesId});
  } catch (err) { 
    throw new Error("Error counting number of imported employees");
  }
}  

async function countImportedEmployeesExistingAsync(importEmployeesId: Types.ObjectId): Promise<number> {
  try {    
    return ImportedEmployeeExistingModel.countDocuments({importEmployeesId: importEmployeesId});
  } catch (err) { 
    throw new Error("Error counting number of imported existing employees");
  }
} 

async function countImportedEmployeesErrorAsync(importEmployeesId: Types.ObjectId): Promise<number> {
  try {    
    return ImportedEmployeeErrorModel.countDocuments({importEmployeesId: importEmployeesId});
  } catch (err) { 
    throw new Error("Error counting number of imported error employees");
  }
} 

function buildEmployeeSearchPipeline(query: ImportedEmployeesHistoryRequest): any[] {
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
      $match: { importEmployeesId: new ObjectId(query.id) }
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

function buildImportedEmployeeErrorSearchPipeline(query: ImportedEmployeesHistoryRequest): any[] {
  
  const pipeline: any[] = [];

  if (query.id) {
    pipeline.push({
      $match: { importEmployeesId: new ObjectId(query.id) }
    });
  } 
 
  const { page, pageSize } = parsePagination(query);
  pipeline.push(
    { $sort: { employee: 1 } },
    { $skip: (page - 1) * pageSize },
    { $limit: pageSize }
  );

  return pipeline;
} 

function parsePagination(query: ImportedEmployeesHistoryRequest, defaults = { page: 1, pageSize: PAGE_SIZE }) {
  const page = typeof query.page === 'number' ? query.page : parseInt(query.page ?? '', PAGE_SIZE) || defaults.page;
  const pageSize = typeof query.pageSize === 'number' ? query.pageSize : parseInt(query.pageSize ?? '', 10) || defaults.pageSize;    
  return { page, pageSize };
}
 
function buildLastEmployeeImportsPipeline(limit = 5) {

  const lastEmployeeImportsPipeline: PipelineStage[] = [
    { $sort: { date: -1 as const } },
    { $limit: 5 },
    {
      $lookup: {
        from: "importedemployeeerrors",
        localField: "_id",
        foreignField: "importEmployeesId",
        as: "errors"
      }
    },
    {
      $lookup: {
        from: "importedemployeeexistings",
        localField: "_id",
        foreignField: "importEmployeesId",
        as: "existing"
      }
    },
    {
      $lookup: {
        from: "employees",
        localField: "_id",
        foreignField: "importEmployeesId",
        as: "importedEmployees"
      }
    },
    {
      $project: {
        id: "$_id",
        date: 1,
        errors: 1, 
        importedEmployeesCount: { $size: { $ifNull: ["$importedEmployees", []] } },
        importedEmployeesExistingCount: { $size: { $ifNull: ["$existing", []] } },
        importedEmployeesErrorsCount: { $size: { $ifNull: ["$errors", []] } },
        _id: 0
      }
    }
  ];

  return lastEmployeeImportsPipeline;
}
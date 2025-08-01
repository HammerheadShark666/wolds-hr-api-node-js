import { Types } from 'mongoose'; 
import { EmployeeModel, IEmployee } from '../models/employee.model';
import { EmployeeSearchResponse, EmployeeSearchRequest, EmployeeSearchPagedResponse } from '../interface/employee';
import { toEmployeeSearchResponse } from '../utils/mapper'; 

const PAGE_SIZE = 5;

export async function searchEmployeesPagedAsync(query: EmployeeSearchRequest): Promise<EmployeeSearchPagedResponse> {

  const { keyword, departmentId } = query;  
  let page = Number.isNaN(Number(query.page)) ? 1 : Number(query.page);
  let pageSize = Number.isNaN(Number(query.pageSize)) ? PAGE_SIZE : Number(query.pageSize);
 
  [page, pageSize] = validatePagination(page, pageSize);
 
  const [totalEmployees, employees] = await Promise.all([
    countEmployeesAsync(keyword, departmentId),
    searchEmployeesAsync({ keyword, departmentId, page, pageSize }).then(r => r.data ?? [])
  ]); 

  console.log(employees)

  return {
    page,
    pageSize,
    totalEmployees,
    totalPages: Math.ceil(totalEmployees / pageSize),
    employees: employees.map(toEmployeeSearchResponse),
    success: true
  };
} 

export async function searchEmployeesAsync(query: EmployeeSearchRequest): Promise<EmployeeSearchResponse> {
  try {
    const pipeline = buildEmployeeSearchPipeline(query);
    const result = await EmployeeModel.aggregate(pipeline);
    return { success: true, data: result };
  } catch (err) {
    console.error('searchEmployeesAsync error:', err);
    return {
      success: false,
      error: 'Failed to search employees. Please try again later.',
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
    console.error('countEmployeesAsync error:', err);
    return 0;
  }
}

function parsePagination(query: EmployeeSearchRequest, defaults = { page: 1, pageSize: PAGE_SIZE }) {
  const page = typeof query.page === 'number' ? query.page : parseInt(query.page ?? '', PAGE_SIZE) || defaults.page;
  const pageSize = typeof query.pageSize === 'number' ? query.pageSize : parseInt(query.pageSize ?? '', 10) || defaults.pageSize;
  return { page, pageSize };
}

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
 
function validatePagination(page: number, pageSize: number): [number, number]{

  let validPage = Number(page);
  let validPageSize = Number(pageSize);
 
  if (Number.isNaN(validPage) || validPage < 1) {
    validPage = 1;
  } 

  const DEFAULT_PAGE_SIZE = PAGE_SIZE;
  const MAX_PAGE_SIZE = 100;
  if (Number.isNaN(validPageSize ) || validPageSize  < 1 || validPageSize > MAX_PAGE_SIZE) {
    validPageSize  = DEFAULT_PAGE_SIZE;
  }

  return  [validPage, validPageSize];
}
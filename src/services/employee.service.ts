import { Types } from 'mongoose'; 
import { EmployeeModel, IEmployee } from '../models/employee.model';
import { EmployeeSearchResponse, EmployeeSearchRequest, EmployeeSearchPagedResponse } from '../interface/employee';
import { toEmployeeSearchResponse } from '../utils/mapper';


export async function searchEmployeesPagedAsync(
  query: EmployeeSearchRequest
): Promise<EmployeeSearchPagedResponse> {
  const { keyword, departmentId } = query;
  const page: number = query.page ?? 1;
  const pageSize = query.pageSize ?? 10;

  const [totalEmployees, employees] = await Promise.all([
    countEmployeesAsync(keyword, departmentId),
    searchEmployeesAsync({ keyword, departmentId, page, pageSize }).then(r => r.data ?? [])
  ]);

  
  const mappedEmployees = employees.map(toEmployeeSearchResponse);

  console.log(" = ",  mappedEmployees)
 

  return {
    page,
    pageSize,
    totalEmployees,
    employees: mappedEmployees,
    success: true
  };
}


export async function searchEmployeesAsync(employeeSearchQuery: EmployeeSearchRequest): Promise<EmployeeSearchResponse> {
  try {
    const pipeline: any[] = [
      {
        $lookup: {
          from: 'departments', // MongoDB collection name (usually lowercase plural)
          localField: 'departmentId',
          foreignField: '_id',
          as: 'department',
        },
      },
      {
        $unwind: {
          path: '$department',
          preserveNullAndEmptyArrays: true, // left join behavior
        },
      },
    ];

    // Optional: Add keyword filter
    if (employeeSearchQuery.keyword && employeeSearchQuery.keyword.trim()) {
      pipeline.push({
        $match: {
          surname: {
            $regex: `^${employeeSearchQuery.keyword.trim()}`,
            $options: 'i', // case-insensitive
          },
        },
      });
    }

    // Optional: Add departmentId filter
    if (employeeSearchQuery.departmentId && Types.ObjectId.isValid(employeeSearchQuery.departmentId)) {
      pipeline.push({
        $match: {
          departmentId: new Types.ObjectId(employeeSearchQuery.departmentId),
        },
      });
    }

    let page: number = 1;
    let pageSize: number = 10;

    if (employeeSearchQuery.page !== undefined) {
  page = typeof employeeSearchQuery.page === 'number' 
    ? employeeSearchQuery.page 
    : parseInt(employeeSearchQuery.page, 10);
}

if (employeeSearchQuery.pageSize !== undefined) {
  pageSize = typeof employeeSearchQuery.pageSize === 'number' 
    ? employeeSearchQuery.pageSize 
    : parseInt(employeeSearchQuery.pageSize, 10);
} 

    // Sort and paginate
    pipeline.push(
      { $sort: { surname: 1, firstName: 1 } },
      { $skip: (page - 1) * pageSize },
      { $limit: pageSize }
    );

    const result = await EmployeeModel.aggregate(pipeline);
    return { success: true, data: result };

   } 
   catch (err) {
    console.error('searchEmployeesAsync error:', err);
    return {
      success: false,
      error: 'Failed to search employees. Please try again later.',
    };
  }
}


async function countEmployeesAsync(keyword?: string, departmentId?: string): Promise<number> {
  const filter: any = {};

  if (keyword?.trim()) {
    filter.surname = { $regex: `^${keyword.trim()}`, $options: 'i' };
  }

  if (departmentId && Types.ObjectId.isValid(departmentId)) {
    filter.departmentId = new Types.ObjectId(departmentId);
  }

  return EmployeeModel.countDocuments(filter);
}
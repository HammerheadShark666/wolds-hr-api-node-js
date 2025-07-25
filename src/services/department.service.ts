import { DepartmentResponse } from '../interface/department';
import { DepartmentModel, IDepartment } from '../models/department.model';
import { ServiceResult } from '../types/ServiceResult';
import { handleServiceError } from '../utils/error.helper';
import { toDepartmentResponse } from '../utils/mapper'; 
import { addDepartmentSchema } from '../validation/department/addDepartment.schema';
import { deleteDepartmentSchema } from '../validation/department/deleteDepartment.schema';
import { departmentNameSchema } from '../validation/department/fields/departmentName.schema';
import { updateDepartmentSchema } from '../validation/department/updateDepartment.schema';
import { idSchema } from '../validation/fields/id.schema';
import { validate } from '../validation/validate';

export async function getDepartments(): Promise<ServiceResult<IDepartment[]>> {
  try { 
    const departments = await DepartmentModel.find().exec(); 
    return { success: true, data: departments };
  } catch (err: any) {
    return { success: false, error: ['Unexpected error: ' + err.message] };
  }
} 
  
export async function getDepartmentById(id: unknown): Promise<ServiceResult<IDepartment>> {
 
  const validationResult = await validate(idSchema, id);  
  if (!validationResult.success) {
    return validationResult;
  }   
  const validData = validationResult.data;

  try {
    const department = await DepartmentModel.findById(id).exec();
    if (!department) {
      return { success: false, error: ['Department not found'] };
    }

    return { success: true, data: department };
  } 
  catch (err: any) { 
    return handleServiceError(err);
  }
} 

export async function getDepartmentByName(name: string): Promise<ServiceResult<IDepartment | null>> { 

  const validationResult = await validate(departmentNameSchema, name);  
  if (!validationResult.success) {
    return validationResult;
  }  
  const validData = validationResult.data;
  
  try {
    const department = await DepartmentModel.findOne({ name: validData }).exec();
    return { success: true, data: department }; 
  } 
  catch (err: any) { 
    return handleServiceError(err);
  }
}

export async function addDepartment(data: unknown): Promise<ServiceResult<DepartmentResponse>> {
    
  const validationResult = await validate(addDepartmentSchema, data);  
  if (!validationResult.success) {
    return validationResult;
  }  
  const validData = validationResult.data;
 
  try {
    const department = new DepartmentModel(validData);
    const saved = await department.save();  
    return { success: true, data: toDepartmentResponse(saved) };
  } 
  catch (err: any) {  
    return handleServiceError(err); 
  }
} 

export async function updateDepartment(id: string, name: string): Promise<ServiceResult<DepartmentResponse>> {
      
  const validationResult = await validate(updateDepartmentSchema, { id, name });  
  if (!validationResult.success) {
    return validationResult;
  }  
  const validData = validationResult.data;
  
  try {
    const updated = await DepartmentModel.findByIdAndUpdate(
      validData.id,
      { $set: { name: validData.name } },
      { new: true }
    );

    if (!updated) {
      return { success: false, error: ['Department not found'] };
    }

    return { success: true, data: toDepartmentResponse(updated) };
  } 
  catch (err: any) { 
    return handleServiceError(err);
  }
} 

export async function deleteDepartment(id: string): Promise<ServiceResult<IDepartment | null>> {
  
  const validationResult = await validate(deleteDepartmentSchema, { id });  
  if (!validationResult.success) {
    return validationResult;
  }  
  const validData = validationResult.data; 

  try {
    await DepartmentModel.findByIdAndDelete(validData.id);
    return { success: true, data: null };
  } 
  catch (err: any) { 
    return handleServiceError(err);
  }
}
import { DepartmentResponse } from '../interface/department';
import { DepartmentModel, IDepartment } from '../models/department.model';
import { ServiceResult } from '../types/ServiceResult';
import { handleServiceError } from '../utils/error.helper';
import { toDepartmentResponse } from '../utils/mapper'; 
import { addDepartmentSchema } from '../validation/department/addDepartment.schema';
import { deleteDepartmentSchema } from '../validation/department/deleteDepartment.schema'; 
import { getDepartmentByIdSchema } from '../validation/department/getDepartmentById.schema';
import { getDepartmentByNameSchema } from '../validation/department/getDepartmentByName.schema';
import { updateDepartmentSchema } from '../validation/department/updateDepartment.schema'; 
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
   
  const validationResult = await validate(getDepartmentByIdSchema, {id});  
  if (!validationResult.success) { 
    return validationResult;
  }    

  try {

    const { id: validId } = validationResult.data; 

    const department = await DepartmentModel.findById(validId).exec();
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

  const validationResult = await validate(getDepartmentByNameSchema, name);  
  if (!validationResult.success) {
    return validationResult;
  }
  
  try {
    const { name: validName } = validationResult.data;
    const department = await DepartmentModel.findOne({ name: validName }).exec();
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
  
  try {

    const { id: validId, name: validName } = validationResult.data;

    const updated = await DepartmentModel.findByIdAndUpdate(
      validId,
      { $set: { name: validName } },
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

  try {

    const { id: validId } = validationResult.data;

    await DepartmentModel.findByIdAndDelete(validId);
    return { success: true, data: null };
  } 
  catch (err: any) { 
    return handleServiceError(err);
  }
}
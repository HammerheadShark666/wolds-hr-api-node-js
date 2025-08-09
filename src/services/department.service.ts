import { AddDepartmentRequest, DepartmentResponse, UpdatedDepartmentResponse, UpdateDepartmentRequest } from '../interface/department';
import { DepartmentModel, IDepartment } from '../models/department.model';
import { ServiceResult } from '../types/ServiceResult';
import { handleServiceError } from '../utils/error.helper';
import { toDepartmentResponse } from '../utils/mapper'; 
import { addDepartmentSchema } from '../validation/department/addDepartment.schema';
import { deleteDepartmentSchema } from '../validation/department/deleteDepartment.schema'; 
import { getDepartmentByIdSchema } from '../validation/department/getDepartmentById.schema'; 
import { updateDepartmentSchema } from '../validation/department/updateDepartment.schema'; 
import { validate } from '../validation/validate';

//Service export functions

export async function getDepartmentsAsync(): Promise<ServiceResult<IDepartment[]>> {
  try { 
    const departments = await DepartmentModel.find().exec(); 
    return { success: true, data: departments };
  } catch (err: unknown) {
    return handleServiceError(err); 
  }
} 
  
export async function getDepartmentByIdAsync(id: string): Promise<ServiceResult<IDepartment>> {
   
  const validationResult = await validate(getDepartmentByIdSchema, {id});  
  if (!validationResult.success) { 
    return { success: false, code: 400, error: validationResult.error }
  }    

  try {
 
    const department = await DepartmentModel.findById(id).exec();
    if (!department) {
      return { success: false, error: ['Department not found'], code: 404 };
    } 

    return { success: true, data: department };
  } 
  catch (err: unknown) { 
    return handleServiceError(err);
  }
} 
 
export async function addDepartmentAsync(data: AddDepartmentRequest): Promise<ServiceResult<DepartmentResponse>> {
    
  const validationResult = await validate(addDepartmentSchema, data);  
  if (!validationResult.success) {
    return { success: false, code: 400, error: validationResult.error }
  }   
 
  try {

    if ((await departmentNameExistsAsync(data.name))) {
      return {success: false, code: 400, error: ['Department name exists already']};
    }   

    const department = new DepartmentModel(data);
    const saved = await department.save();  
    return { success: true, data: toDepartmentResponse(saved) };
  } 
  catch (err: unknown) {  
    return handleServiceError(err); 
  }
} 

export async function updateDepartmentAsync(data: UpdateDepartmentRequest): Promise<ServiceResult<UpdatedDepartmentResponse>> {
      
  const validationResult = await validate(updateDepartmentSchema, { id: data.id, name: data.name });  
  if (!validationResult.success) {
    return { success: false, code: 400, error: validationResult.error }
  }   
  
  try {
 
    const existingDepartment = await DepartmentModel.findOne({ name: data.name }); 
    if (existingDepartment && existingDepartment.id !== data.id) {
      return {success: false, code: 404, error: ['Department name exists already']};
    }
 
    const updatedDepartment = await DepartmentModel.findByIdAndUpdate(
      data.id,
      { $set: { name:data.name } },
      { new: true }
    );

    if (!updatedDepartment) {
      return { success: false, error: ['Department not found'], code: 400 };
    }

    const updatedDepartmentResponse: UpdatedDepartmentResponse = { message: "Department updated successfully", departmentId: updatedDepartment.id }; 
    return { success: true, data: updatedDepartmentResponse }; 
  } 
  catch (err: unknown) { 
    return handleServiceError(err);
  }
} 

export async function deleteDepartmentAsync(id: string): Promise<ServiceResult<IDepartment | null>> {
  
  const validationResult = await validate(deleteDepartmentSchema, { id });  
  if (!validationResult.success) {
    return { success: false, code: 400, error: validationResult.error }
  } 

  try {
   
    if (!(await departmentExistsAsync(id))) { 
      return {success: false, code: 404, error: ['Department not found']};
    }   

    await DepartmentModel.findByIdAndDelete(id);
    return { success: true, data: null };
  } 
  catch (err: unknown) { 
    return handleServiceError(err);
  }
}

export async function departmentExistsAsync(id: string): Promise<boolean> {
  const exists = await DepartmentModel.exists({ _id: id }).exec(); 
  return !!exists;
}

export async function departmentNameExistsAsync(departmentName: string): Promise<boolean> {
  const exists = await DepartmentModel.exists({ 'name': departmentName }).exec();
  return !!exists;
}
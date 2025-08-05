import { DepartmentResponse, UpdatedDepartmentResponse } from '../interface/department';
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
  
export async function getDepartmentByIdAsync(id: unknown): Promise<ServiceResult<IDepartment>> {
   
  const validationResult = await validate(getDepartmentByIdSchema, {id});  
  if (!validationResult.success) { 
    return { success: false, code: 400, error: validationResult.error }
  }    

  try {

    const { id: validId } = validationResult.data; 

    const department = await DepartmentModel.findById(validId).exec();
    if (!department) {
      return { success: false, error: ['Department not found'], code: 404 };
    } 

    return { success: true, data: department };
  } 
  catch (err: unknown) { 
    return handleServiceError(err);
  }
} 
 
export async function addDepartmentAsync(data: unknown): Promise<ServiceResult<DepartmentResponse>> {
    
  const validationResult = await validate(addDepartmentSchema, data);  
  if (!validationResult.success) {
    return { success: false, code: 400, error: validationResult.error }
  }  
  const validData = validationResult.data;
 
  try {

    if ((await departmentNameExistsAsync(validData.name))) {
      return {success: false, code: 400, error: ['Department name exists already']};
    }   

    const department = new DepartmentModel(validData);
    const saved = await department.save();  
    return { success: true, data: toDepartmentResponse(saved) };
  } 
  catch (err: unknown) {  
    return handleServiceError(err); 
  }
} 

export async function updateDepartmentAsync(id: string, name: string): Promise<ServiceResult<UpdatedDepartmentResponse>> {
      
  const validationResult = await validate(updateDepartmentSchema, { id, name });  
  if (!validationResult.success) {
    return { success: false, code: 400, error: validationResult.error }
  }   
  
  try {

    const { id: validId, name: validName } = validationResult.data;

    const existingDepartment = await DepartmentModel.findOne({ name: validName }); 
    if (existingDepartment && existingDepartment.id !== validId) {
      return {success: false, code: 404, error: ['Department name exists already']};
    }
 
    const updatedDepartment = await DepartmentModel.findByIdAndUpdate(
      validId,
      { $set: { name: validName } },
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

    const { id: validId } = validationResult.data;

    if (!(await departmentExistsAsync(validId))) {
      return {success: false, code: 404, error: ['Department not found']};
    }   

    await DepartmentModel.findByIdAndDelete(validId);
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
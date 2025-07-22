import { AppDepartment } from '../interface/department';
import { DepartmentModel, IDepartment } from '../models/department.model';
import { ServiceResult } from '../types/ServiceResult';
import { mapDepartment } from '../utils/mapper'; 
import { createDepartmentSchema } from '../validation/department/createDepartment.schema';
import { deleteDepartmentSchema } from '../validation/department/deleteDepartment.schema';
import { updateDepartmentSchema } from '../validation/department/updateDepartment.schema';
import { idSchema } from '../validation/general/id.schema';

export async function getDepartments(): Promise<ServiceResult<IDepartment[]>> {
  return { success: true, data: await DepartmentModel.find().exec() };
} 
  
export async function getDepartmentById(id: unknown): Promise<ServiceResult<IDepartment>> {
  const parseResult = idSchema.safeParse(id);

  if (!parseResult.success) {
    return { success: false, error: parseResult.error.issues.map(i => i.message) };
  }

  try {
    const department = await DepartmentModel.findById({ _id: parseResult.data }).exec();

    if (!department) {
      return { success: false, error: ['Department not found'] };
    }

    return { success: true, data: department };
  } catch (err: any) {
    return { success: false, error: ['Unexpected error: ' + err.message] };
  }
} 

export async function getDepartmentByName(name: string): Promise<IDepartment | null> { 
  return await DepartmentModel.findOne({ name: name }).exec();
}

export async function createDepartment(data: unknown): Promise<ServiceResult<AppDepartment>> {
  
  const parsed = await createDepartmentSchema.safeParseAsync(data);
  if (!parsed.success) {
    const errors = parsed.error.issues.map(issue => issue.message);
    return { success: false, error: errors };
  }
 
  try {
    const department = new DepartmentModel(parsed.data);
    const saved = await department.save();  
    return { success: true, data: mapDepartment(saved) };
  } catch (err: any) {
    if (err.code === 11000) {
      return { success: false, error: ['Department name already exists'] };
    }

    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e: any) => e.message);
      return { success: false, error: messages };
    }

    return { success: false, error: ['Unexpected error: ' + err.message] };
  }
} 

export async function updateDepartment(id: string, name: string): Promise<ServiceResult<AppDepartment>> {
   
  console.log("Update validation");

  const parsed = await updateDepartmentSchema.safeParseAsync({ id, name });
  if (!parsed.success) {
    console.log("VALIDATION ERRORS:", parsed.error.format());
    const errors = parsed.error.issues.map(issue => issue.message);
    return { success: false, error: errors };
  }
  
  try {
    const updated = await DepartmentModel.findByIdAndUpdate(
      id,
      { $set: { name: name } },
      { new: true }
    );

    if (!updated) {
      return { success: false, error: ['Department not found'] };
    }

    return { success: true, data: mapDepartment(updated) };
  } catch (err: any) {
    return { success: false, error: ['Unexpected error: ' + err.message] };
  }
} 

export async function deleteDepartment(id: string): Promise<ServiceResult<IDepartment | null>> {

  const parsed = await deleteDepartmentSchema.safeParseAsync({ id }); 
  if (!parsed.success) {
    const errors = parsed.error.issues.map(issue => issue.message);
    return { success: false, error: errors };
  } 

  try {
    await DepartmentModel.findByIdAndDelete(id);
    return { success: true, data: null };
  } catch (err: any) {
    return { success: false, error: ['Unexpected error: ' + err.message] };
  }
}
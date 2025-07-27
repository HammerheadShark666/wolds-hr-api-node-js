import { baseDepartmentSchema } from './baseDepartment.schema';
import { DepartmentModel } from '../../models/department.model';
import { validateUnique } from '../validator/validateUnique';

export const addDepartmentSchema = baseDepartmentSchema.superRefine(
  async (data, ctx) => {
    await validateUnique(DepartmentModel, 'name', 'Department name already exists')(data, ctx);
  }
);
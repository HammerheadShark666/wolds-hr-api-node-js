import { baseDepartmentSchema } from './baseDepartment.schema';
import { DepartmentModel } from '../../models/department.model';
import { uniqueValidator } from '../utils/uniqueValidator';

export const createDepartmentSchema = baseDepartmentSchema.superRefine(
  async (data, ctx) => {
    await uniqueValidator(DepartmentModel, 'name', 'Department name already exists')(data, ctx);
  }
);
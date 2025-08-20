import { Types } from "mongoose"; 
import { DepartmentModel, IDepartment } from "../models/department.model";

export async function getEmployeeDepartmentId(name: string): Promise<Types.ObjectId> {
  // const department: IDepartment | null = await DepartmentModel.findOne({ name });

  // if (!department) {
  //   throw new Error(`Department not found - ${name}`);
  // }

  // return department._id;

//  const department = await DepartmentModel.findOne({ name });

  //console.log("department = ", department)

  return new Types.ObjectId('68a5e82bee6dd9293bf8aad6');
}

 
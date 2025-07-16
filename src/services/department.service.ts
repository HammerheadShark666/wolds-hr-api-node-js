import { DepartmentModel, IDepartment } from '../models/department.model';

export async function getDepartments(): Promise<IDepartment[] | null> {
  return DepartmentModel.find().exec();
}

export async function getDepartmentById(id: string): Promise<IDepartment | null> { 
  return DepartmentModel.findOne({ _id: id }).exec();
}

export async function getDepartmentByName(name: string): Promise<IDepartment | null> { 
  return DepartmentModel.findOne({ name: name }).exec();
}

export async function createDepartment(name: string): Promise<IDepartment | null> {

  const document = { 
    name: name
  };

  return await DepartmentModel.insertOne(document);
} 

export async function updateDepartment(id: string, name: string): Promise<IDepartment | null> {

  const updatedDepartment = await DepartmentModel.findByIdAndUpdate(
    id,                          
    { $set: { name: 'name' } }
  );
  return updatedDepartment;
}

export async function deleteDepartment(id: string): Promise<IDepartment | null> {
  return await DepartmentModel.findByIdAndDelete(id);
}
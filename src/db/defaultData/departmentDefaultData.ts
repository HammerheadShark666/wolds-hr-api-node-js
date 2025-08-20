import { DepartmentDefaultData } from '../../interface/department';
import { DepartmentModel } from '../../models/department.model';

export async function insertDefaultDepartments() {
  try {  
    const departments = getDepartmentAsyncDefaultData(); 
    const insertedDepartments = await DepartmentModel.insertMany(departments);

    // if(insertedDepartments.length > 0)
    //   global.departments = insertedDepartments; 
 
    console.log(`Inserted ${insertedDepartments.length} departments.`); 
  } catch (err) {
    console.error('Error inserting departments:', err);
  }
}

function getDepartmentAsyncDefaultData() { 

  const departments: DepartmentDefaultData[] = [
    {
      name: "Operations",
    },
    {
      name: "Marketing",
    },
    {
      name: "Human Resource",
    },
    {
      name: "IT",
    },
    {
      name: "Finance",
    },
    {
      name: "QA",
    },
  ];

  return departments;
}

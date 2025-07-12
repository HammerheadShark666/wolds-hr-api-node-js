import type { RxDatabase } from 'rxdb'; 
import { v4 as uuidv4 } from 'uuid'; 
import { WoldsHrDatabaseCollections } from '../collection/databaseCollection';
import { ApiEmployee } from '../../interface/employee';
 
export async function employeeDefaultData(db: RxDatabase<WoldsHrDatabaseCollections>) {  

    const employees = await getRandomEmployeeDefaultData(db);

    for (const emp of employees) {
        console.log(`Inserting employee: ${emp.firstName} ${emp.surname}`);
        await db.employees.insert(emp);
    }
}
 

interface Employee {
  id: string;
  firstName: string;
  surname: string;
  // dateOfBirth: string;
  // hireDate: string;
  // departmentId: string; // assuming department ID is a string
  // email: string;
  // phoneNumber: string;
  // photo: string;
  // created: string;
}

// Async function to fetch department IDs from RxDB
async function getRandomEmployeeDefaultData(db: RxDatabase<WoldsHrDatabaseCollections>) {
     
  const employees: ApiEmployee[] = [];

  // Get department IDs from db
  const departmentIds = (await db.departments.find().exec()).map((d: any) => d.id);

  const surnames = ["Miller", "Smith", "Brown", "Johnson", "Taylor", "Anderson", "Lee", "Walker", "Hall", "Clark", "Patel", "Johnstone", "Johnsen", "Harper", "Jones", "Singh", "Booth", "Collier", "Derry", "Ericsson", "Fortune", "Gray", "Horton", "Kingston", "Morton", "Norton"];
  const firstNames = ["John", "Emily", "Michael", "Sarah", "David", "Emma", "Daniel", "Olivia", "James", "Sophia", "Brian", "Neil", "Helen", "Mary", "Jill", "Jennifer", "Henry", "Abigail", "Barry", "Derek", "Eric", "Frank", "Gail", "Kelly", "Larry", "Ruth", "Simon", "Tony"];
  
  for (let i = 0; i < 100; i++) {
    const firstName = firstNames[randomInt(0, firstNames.length - 1)];
    const surname = surnames[randomInt(0, surnames.length - 1)];
    const email = `${firstName[0].toLowerCase()}${surname.toLowerCase()}${i}@example.com`;
    const dateOfBirth = randomDate(1960, 2000);
    const hireDate = randomDate(2015, 2023);
    const created = new Date().toISOString().split('T')[0];
  
    employees.push({ id: uuidv4(), surname: surname, firstName: firstName, _meta: { lwt: Date.now() }, _deleted: false, _attachments: {}, _rev: "test-data" });
  }

  return employees;
}

// Helpers
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(startYear: number, endYear: number): string {
  const year = randomInt(startYear, endYear);
  const month = randomInt(1, 12);
  const day = randomInt(1, 28); // safe for all months
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

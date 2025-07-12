import type { RxDatabase } from 'rxdb'; 
import { v4 as uuidv4 } from 'uuid';
import { WoldsHrDatabaseCollections } from '../db';
import { NewDepartment } from '../../interface/APIDepartment';

export async function departmentDefaultData(db: RxDatabase<WoldsHrDatabaseCollections>) {  


    const newDepartments: NewDepartment[] = [
        { id: uuidv4(), name: 'Human Resource' },
        { id: uuidv4(), name: 'IT' },
        { id: uuidv4(), name: 'Finance' },
        { id: uuidv4(), name: 'Marketing' },
        { id: uuidv4(), name: 'Operations' },
        { id: uuidv4(), name: 'QA' },
        { id: uuidv4(), name: 'Accounts' },
        ];

        for (const department of newDepartments) {
            await db.departments.insert(department);
        }




    // await db.departments.insert({ id: uuidv4(), name: "Human Resource" });
    // await db.departments.insert({ id: uuidv4(), name: "IT" });
    // await db.departments.insert({ id: uuidv4(), name: "Finance" });
    // await db.departments.insert({ id: uuidv4(), name: "Marketing" });
    // await db.departments.insert({ id: uuidv4(), name: "Operations" });
    // await db.departments.insert({ id: uuidv4(), name: "QA" });
    // await db.departments.insert({ id: uuidv4(), name: "Accounts" }); 
} 
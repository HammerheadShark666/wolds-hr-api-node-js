import type { RxDatabase } from 'rxdb'; 
import { v4 as uuidv4 } from 'uuid';

export async function departmentDefaultData(db: RxDatabase) {  
    await db.departments.insert({ id: uuidv4(), name: "Human Resource" });
    await db.departments.insert({ id: uuidv4(), name: "IT" });
    await db.departments.insert({ id: uuidv4(), name: "Finance" });
    await db.departments.insert({ id: uuidv4(), name: "Marketing" });
    await db.departments.insert({ id: uuidv4(), name: "Operations" });
    await db.departments.insert({ id: uuidv4(), name: "QA" });
    await db.departments.insert({ id: uuidv4(), name: "Accounts" }); 
}
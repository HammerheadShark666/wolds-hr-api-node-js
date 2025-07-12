import type { RxDatabase } from 'rxdb'; 
import { v4 as uuidv4 } from 'uuid'; 
import { WoldsHrDatabaseCollections } from '../collection/databaseCollection';
import { ApiDepartment } from '../../interface/department';

export async function departmentDefaultData(db: RxDatabase<WoldsHrDatabaseCollections>) {  

  const newDepartments: ApiDepartment[] = [
    { id: uuidv4(), name: 'Human Resource', _meta: { lwt: Date.now() }, _deleted: false, _attachments: {}, _rev: "test-data" },
    { id: uuidv4(), name: 'IT', _meta: { lwt: Date.now() }, _deleted: false, _attachments: {}, _rev: "test-data" },
    { id: uuidv4(), name: 'Finance', _meta: { lwt: Date.now() }, _deleted: false, _attachments: {}, _rev: "test-data" },
    { id: uuidv4(), name: 'Marketing', _meta: { lwt: Date.now() }, _deleted: false, _attachments: {}, _rev: "test-data" },
    { id: uuidv4(), name: 'Operations', _meta: { lwt: Date.now() }, _deleted: false, _attachments: {}, _rev: "test-data" },
    { id: uuidv4(), name: 'QA', _meta: { lwt: Date.now() }, _deleted: false, _attachments: {}, _rev: "test-data" },
    { id: uuidv4(), name: 'Accounts', _meta: { lwt: Date.now() }, _deleted: false, _attachments: {}, _rev: "test-data" },
  ];

  for (const department of newDepartments) {
      await db.departments.insert(department);
  } 
} 
import mongoose, { Types } from 'mongoose'; 
import { EmployeeModel } from '../../models/employee.model';
import { Department } from '../../types/department';
import { EmployeeDefaultData } from '../../interface/employee';
 
export async function insertDefaultEmployees() {
  try { 
    const departments = await mongoose.model('Department').find().exec();
    if (departments.length === 0) {
      console.log('No departments found. Aborting insertion.');
      return;
    }
 
    const employees = getEmployeeDefaultData(departments); 
    const insertedEmployees = await EmployeeModel.insertMany(employees);

    const randomEmployees = getRandomEmployeeDefaultData(departments);
    const insertedRandomEmployees = await EmployeeModel.insertMany(randomEmployees);

    console.log(`Inserted ${insertedEmployees.length} employees.`);
    console.log(`Inserted ${insertedRandomEmployees.length} random employees.`);
  } catch (err) {
    console.error('Error inserting employees:', err);
  }
}
  
function getRandomDepartmentId(departments: Department[]) {
  const randomIndex = Math.floor(Math.random() * departments.length);
  return departments[randomIndex]._id;
} 

function getEmployeeDefaultData(departments: Department[]) {
  const now = new Date();

  const employees: EmployeeDefaultData[] = [
    {
      surname: "Miller",
      firstName: "John",
      dateOfBirth: new Date(1966, 2, 21),
      hireDate: new Date(2021, 4, 27),
      email: "jmiller@hotmail.com",
      phoneNumber: "04545 560934",
      photo: "jmiller.jpg",
    },
    {
      surname: "How",
      firstName: "Helen",
      dateOfBirth: new Date(1996, 11, 3),
      hireDate: new Date(2024, 7, 12),
      email: "hhanigan@hotmail.com",
      phoneNumber: "12473 846285",
      photo: "hhow.jpg",
    },
    {
      surname: "Johns",
      firstName: "Jill",
      dateOfBirth: new Date(2005, 3, 11),
      hireDate: new Date(2022, 7, 22),
      email: "jjohns@hotmail.com",
      phoneNumber: "23465 889453",
    },
    {
      surname: "Johnston",
      firstName: "Neil",
      dateOfBirth: new Date(2002, 1, 22),
      hireDate: new Date(2023, 8, 21),
      email: "njohnston@hotmail.com",
      phoneNumber: "33243 432435",
    },
    {
      surname: "Johnstone",
      firstName: "Mary",
      dateOfBirth: new Date(1999, 8, 26),
      hireDate: new Date(2024, 2, 8),
      email: "mjohnstone@hotmail.com",
      phoneNumber: "38967 674523",
    },
    {
      surname: "Johnsen",
      firstName: "Henrik",
      dateOfBirth: new Date(1989, 7, 11),
      hireDate: new Date(2021, 3, 7),
      email: "hjohnsen@hotmail.com",
      phoneNumber: "23547 237573",
    },
  ];

  return employees.map(e => ({
    ...e,
    photo: e.photo ?? "",
    departmentId: getRandomDepartmentId(departments),
    createdAt: now,
  }));
} 

function getRandomEmployeeDefaultData(departments: Department[]) {
  const employees = [];

  const surnames = [
    "Miller", "Smith", "Brown", "Johnson", "Taylor", "Anderson", "Lee", "Walker",
    "Hall", "Clark", "Patel", "Johnstone", "Johnsen", "Harper", "Jones", "Singh",
    "Booth", "Collier", "Derry", "Ericsson", "Fortune", "Gray", "Horton", "Kingston",
    "Morton", "Norton"
  ];

  const firstNames = [
    "John", "Emily", "Michael", "Sarah", "David", "Emma", "Daniel", "Olivia",
    "James", "Sophia", "Brian", "Neil", "Helen", "Mary", "Jill", "Jennifer",
    "Henry", "Abigail", "Barry", "Derek", "Eric", "Frank", "Gail", "Kelly",
    "Larry", "Ruth", "Simon", "Tony"
  ];

  for (let i = 0; i < 100; i++) {
    const firstName = firstNames[getRandomInt(0, firstNames.length)];
    const surname = surnames[getRandomInt(0, surnames.length)];
    const email = `${firstName[0].toLowerCase()}${surname.toLowerCase()}${i}@example.com`;

    // Random dateOfBirth between 1960 and 1999
    const dobYear = getRandomInt(1960, 2000);
    const dobMonth = getRandomInt(0, 12);
    const dobDay = getRandomInt(1, 28);

    // Random hireDate between 2015 and 2023
    const hireYear = getRandomInt(2015, 2024);
    const hireMonth = getRandomInt(0, 12);
    const hireDay = getRandomInt(1, 28);

    employees.push({
      surname,
      firstName,
      dateOfBirth: new Date(dobYear, dobMonth, dobDay),
      hireDate: new Date(hireYear, hireMonth, hireDay),
      departmentId: departments[getRandomInt(0, departments.length)]._id,
      email,
      phoneNumber: `04${getRandomInt(100, 999)} ${getRandomInt(100000, 999999)}`,
      photo: '',
      createdAt: new Date()
    });
  }

  return employees;
}

function getRandomInt(min: number, max: number) { 
  return Math.floor(Math.random() * (max - min)) + min;
}
import { UserDefaultData } from "../../interface/user";
import { UserModel } from "../../models/user.model";

export async function insertDefaultUsers() {
  try {  
    const Users = getUserAsyncDefaultData(); 
    const insertedUsers = await UserModel.insertMany(Users);
 
    console.log(`Inserted ${insertedUsers.length} Users.`); 
  } catch (err) {
    console.error('Error inserting Users:', err);
  }
}

function getUserAsyncDefaultData() {
  const now = new Date();
  const users: UserDefaultData[] = [
    {
      username: 'john@hotmail.com',
      password: '$2b$10$CDREEZvoprgoA1R371pZM.lW06ac/gz.wooCBvyGQXQfKOqqYSalq',
      firstName: 'John',
      surname: 'Doe', 
      role: 'clerk'
    }, 
  ];
  return users;
}
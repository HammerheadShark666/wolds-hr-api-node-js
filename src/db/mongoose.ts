import mongoose from 'mongoose';

export async function connectToDatabase() {
  const uri = process.env.MONGO_DB_CONNECTION_STRING!;
  await mongoose.connect(uri);
  console.log(`Connected to MongoDB - ${mongoose.connection.name}`);  
}
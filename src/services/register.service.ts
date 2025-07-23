import { ServiceResult } from "../types/ServiceResult";
import { registerSchema } from "../validation/register/register.schema";
import { RegisteredResponse, RegisterRequest } from "../interface/register";
import bcrypt from 'bcryptjs';
import { createUser } from "./user.service";

export async function registerUser(data: RegisterRequest): Promise<ServiceResult<RegisteredResponse>> {
  
  const parsed = await registerSchema.safeParseAsync(data);
  if (!parsed.success) {
    const errors = parsed.error.issues.map(issue => issue.message);
    return { success: false, error: errors };
  }
 
  try { 
          
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt); 

    const user = await createUser({ username: data.username, password: hashedPassword });
    if (!user || !user._id) {
      return { success: false, error: ['Failed to register user'] };
    }

    const registeredResponse: RegisteredResponse = { message: "User registered successfully", userId: user._id.toString() };

    return { success: true, data: registeredResponse }; 
  } catch (err: any) {
     
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e: any) => e.message);
      return { success: false, error: messages };
    }

    return { success: false, error: ['Unexpected error: ' + err.message] };
  }
}
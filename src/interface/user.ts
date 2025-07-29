export interface UserResponse {
  id: string;
  surname: string;
  firstName: string;
  role: string;
}

export interface AddedUserResponse {
  message: string;
  userId: string;
} 

export interface AddUserRequest {
  username: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  surname?: string; 
  role?: string;
}

export interface UpdatedUserResponse {
  message: string;
  userId: string;
}

export interface UpdateUserRequest {
  id: string;
  firstName?: string;
  surname?: string;
}

export interface UserRequest {
  id: string;
  firstName?: string;
  surname?: string;
  role?: string;
}

export interface DeletedUserResponse {
  message: string;
  userId: string;
}
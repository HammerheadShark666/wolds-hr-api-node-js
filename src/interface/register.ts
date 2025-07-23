export interface RegisteredResponse {
  message: string;
  userId: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  confirmPassword: string;
}
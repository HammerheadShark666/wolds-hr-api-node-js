export interface LoginResponse {
  token: string;
  refreshToken: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LogoutRequest {
  refreshToken: string;
}
export interface AuthenticatedResponse {
  token: string;
  refreshToken: string;
}

export interface AuthenticateRequest {
  username: string;
  password: string;
}

export interface LogoutRequest {
  refreshToken: string;
}
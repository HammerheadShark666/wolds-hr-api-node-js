export interface AppAuthenticated {
  token: string;
  refreshToken: string;
}

export interface AppAuthenticate {
  username: string;
  password: string;
}

export interface AppLogout {
  refreshToken: string;
}
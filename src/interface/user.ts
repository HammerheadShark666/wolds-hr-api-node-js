export interface AppUser {
  id: string;
  username: string;
  password: string;
  role: string;
  tokens: string[];
}
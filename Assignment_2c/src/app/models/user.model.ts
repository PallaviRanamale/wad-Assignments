export interface User {
  id?: string;
  name: string;
  email: string;
  password?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
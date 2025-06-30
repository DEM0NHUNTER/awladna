export interface User {
  user_id: number;
  email: string;
  role: 'parent' | 'admin';
}

export interface LoginResponse {
  token: string;
  user: User;
}
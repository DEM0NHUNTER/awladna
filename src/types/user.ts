// src/types/user.ts
export interface User {
  id: number;
  email: string;
  name?: string;
  picture?: string;
  role: string; // Matches UserRole enum in backend
  is_verified: boolean;
  created_at: string; // ISO date string
  updated_at?: string; // ISO date string
}
// store/authStore.ts
import { create } from 'zustand';

interface AuthState {
  token: string | null;
  user: any;
  initialize: () => void;
  login: (token: string, user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  initialize: () => {
    const storedToken = localStorage.getItem('token');
    set({ token: storedToken });
  },
  login: (token, user) => {
    localStorage.setItem('token', token);
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  },
}));
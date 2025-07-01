// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

export interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // On mount: try to load current user
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('token');
      if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const { data } = await axiosInstance.get<{ user: User }>('/auth/me');
          setUser(data.user);
        } catch {
          localStorage.removeItem('token');
          delete axiosInstance.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post<{ token: string; user: User }>(
        '/auth/login',
        { email, password }
      );
      localStorage.setItem('token', data.token);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data.user);
      navigate('/profile');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post<{ token: string; user: User }>(
        '/auth/register',
        { email, password }
      );
      localStorage.setItem('token', data.token);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data.user);
      navigate('/profile');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await axiosInstance.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      delete axiosInstance.defaults.headers.common['Authorization'];
      setUser(null);
      setLoading(false);
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

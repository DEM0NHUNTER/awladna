import apiClient from './api';

interface LoginData {
  email: string;
  password: string;
}

export const login = async (email: string, password: string) => {
  const { data } = await apiClient.post('/auth/login', { email, password });
  return data;
};

export const register = async (email: string, password: string) => {
  const { data } = await apiClient.post('/api/auth/register', {
    email,
    password
  });
  return data;
};
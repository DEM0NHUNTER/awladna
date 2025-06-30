import apiClient from './api';

interface LoginData {
  email: string;
  password: string;
}

export const login = async (email: string, password: string) => {
  const { data } = await apiClient.post('/auth/login', { email, password });
  return data;
};

export const register = async (userData: LoginData) => {
  const { data } = await apiClient.post('auth/register', userData);
  return data;
};
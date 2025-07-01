// src/api/auth.ts

import apiClient from './client';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name : string;
  email: string;
  password: string;
}

interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export const login = async ({ email, password}: LoginPayload) => {
  return apiClient.post('/api/auth/login', { email, password});
};

export const register = async ({ email, password }: RegisterPayload) => {
  return apiClient.post('/api/auth/register', { email, password });
};

export const forgotPassword = async (email: string) => {
  return apiClient.post('/api/auth/forgot-password', { email });
};

export const resetPassword = async ({ token, newPassword }: ResetPasswordPayload) => {
  return apiClient.post('/api/auth/reset-password', { token, newPassword });
};

export const logout = async () => {
  return apiClient.post('/api/auth/logout');
};

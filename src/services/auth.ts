// src/api/auth.ts

import axiosInstance from "@/api/axiosInstance";

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
  return axiosInstance.post('/api/auth/login', { email, password});
};

export const register = async ({ email, password }: RegisterPayload) => {
  return axiosInstance.post('/api/auth/register', { email, password });
};

export const forgotPassword = async (email: string) => {
  return axiosInstance.post('/api/auth/forgot-password', { email });
};

export const resetPassword = async ({ token, newPassword }: ResetPasswordPayload) => {
  return axiosInstance.post('/api/auth/reset-password', { token, newPassword });
};

export const logout = async () => {
  return axiosInstance.post('/api/auth/logout');
};

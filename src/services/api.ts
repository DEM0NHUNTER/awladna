import axios from 'axios'
import apiClient from '../api/axiosInstance';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  withCredentials: true,
})

export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete apiClient.defaults.headers.common['Authorization']
  }
}

// Auth endpoints
export const login = async (email: string, password: string) => {
  const response = await apiClient.post('/auth/login', { email, password })
  return response.data
}

export const register = async (email: string, password: string) => {
  const response = await apiClient.post('/auth/register', { email, password })
  return response.data
}

// Chat endpoints
export const sendMessage = async (token: string, message: string, childId: number) => {
  setAuthToken(token)
  const response = await apiClient.post('/chat', { message, child_id: childId })
  return response.data
}

export const getChatHistory = async (token: string, childId: number) => {
  setAuthToken(token)
  const res = await apiClient.get(`/chat/history/${childId}`)
  return res.data
}

// Child profile endpoints
export const getChildProfiles = async () => {
  const res = await apiClient.get('/auth/child');
  return res.data;            // Array of profiles
};

export const createChildProfile = async (data: any) => {
  const res = await apiClient.post('/auth/child', data);
  return res.data;            // Created profile
};

export const updateChildProfile = async (childId: number, data: any) => {
  const res = await apiClient.put(`/auth/child/${childId}`, data);
  return res.data;            // Updated profile
};

export const deleteChildProfile = async (childId: number) => {
  await apiClient.delete(`/auth/child/${childId}`);
};
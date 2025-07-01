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
  const response = await apiClient.get(`/chat/history/${childId}`)
  return response.data
}

// Child profile endpoints
export const getChildProfiles = async () => {
  const response = await apiClient.get('/child-profiles');
  return response.data;               // List<ChildProfile>
};

export const createChildProfile = async (data: Omit<ChildProfile, 'child_id'>) => {
  const response = await apiClient.post('/child-profiles', data);
  return response.data;               // Created ChildProfile
};

export const updateChildProfile = async (childId: number, data: Omit<ChildProfile, 'child_id'>) => {
  const response = await apiClient.put(`/child-profiles/${childId}`, data);
  return response.data;               // Updated ChildProfile
};

export const deleteChildProfile = async (childId: number) => {
  await apiClient.delete(`/child-profiles/${childId}`);
};
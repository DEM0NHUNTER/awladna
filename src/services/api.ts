import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  withCredentials: true,
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/register', { email, password });
    return response.data;
  },
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    const { access_token } = response.data;
    localStorage.setItem('auth_token', access_token);
    return response.data;
  },
  logout: async () => {
    localStorage.removeItem('auth_token');
    await apiClient.post('/auth/logout');
  },
  verifyEmail: async (token: string) => {
    const response = await apiClient.get(`/verify-email/${token}`);
    return response.data;
  },
  forgotPassword: async (email: string) => {
    const response = await apiClient.post('/forgot-password', { email });
    return response.data;
  },
  resetPassword: async (token: string, newPassword: string) => {
    const response = await apiClient.post('/reset-password', { token, newPassword });
    return response.data;
  }
};

export default apiClient;
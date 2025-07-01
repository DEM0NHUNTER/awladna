import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api',  // ✅ Matches Vercel's proxy configuration
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
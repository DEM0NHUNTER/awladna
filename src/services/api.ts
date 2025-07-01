import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://awladna-api-1017471338215.us-west1.run.app/api', // Update to your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors here
    return Promise.reject(error);
  }
);

export default apiClient;
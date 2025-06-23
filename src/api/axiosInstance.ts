// front_end/src/api/axiosInstance.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});

apiClient.interceptors.request.use((config) => {
  const publicRoutes = ["/auth/register", "/auth/login", "/auth/verify-email"];
  if (publicRoutes.some(route => config.url?.includes(route))) {
    config.withCredentials = false;
  }
  return config;
});

export default apiClient;
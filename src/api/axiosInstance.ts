// front_end/src/api/axiosInstance.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  withCredentials: true
});

// Disable credentials for public routes
apiClient.interceptors.request.use((config) => {
  const publicRoutes = ["/auth/register", "/auth/verify-email", "/auth/resend-verification"];
  if (publicRoutes.some(route => config.url?.includes(route))) {
    config.withCredentials = false;
  }
  return config;
});

export default apiClient;
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  withCredentials: true
});

// Add interceptor to remove token from public routes
apiClient.interceptors.request.use((config) => {
  const excludedRoutes = ["/auth/register", "/auth/verify-email", "/auth/login"];
  if (excludedRoutes.includes(config.url || "")) {
    config.headers["Authorization"] = "";
    localStorage.removeItem("access_token");
  }
  return config;
});
export default axiosInstance;

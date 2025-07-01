// src/api/axiosInstance.ts
import axios from "axios";

let baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
if (baseURL.startsWith("http://")) {
  baseURL = baseURL.replace(/^http:/, "https:");
}

const apiClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  // Public routes
  const publicRoutes = [
    "/auth/register",
    "/auth/login",
    "/auth/verify-email",
    "/auth/forgot-password",
    "/auth/reset-password",
  ];
  const isPublic = publicRoutes.some((r) => config.url?.startsWith(r));
  if (!isPublic) {
    // 🔑 Read the same key you wrote in AuthContext
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }
  return config;
});

export default apiClient;

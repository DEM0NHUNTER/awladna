// src/api/axiosInstance.ts
import axios from "axios";

// Ensure baseURL is always HTTPS and no trailing slash issues
let baseURL = import.meta.env.VITE_API_URL || "https://localhost:8080/api";
if (baseURL.startsWith("http://")) {
  baseURL = baseURL.replace(/^http:/, "https:");
}

const axiosInstance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const publicRoutes = ["/auth/register","/auth/login", /* … */];
  const isPublic = publicRoutes.some((r) => config.url?.startsWith(r));

  // List of public routes that don't need Authorization header
  const publicRoutes = [
    "/auth/register",
    "/auth/login",
    "/auth/verify-email",
    "/auth/forgot-password",
    "/auth/reset-password",
  ];
  const isPublic = publicRoutes.some((r) => config.url?.startsWith(r));
  if (!isPublic) {
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

export default axiosInstance;

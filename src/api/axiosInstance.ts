// src/api/axiosInstance.ts
import axios from "axios";

// Ensure baseURL is always HTTPS
let baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
if (baseURL.startsWith("http://")) {
  baseURL = baseURL.replace(/^http:/, "https:");
}

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Attach Bearer token to all non‑public requests
apiClient.interceptors.request.use((config) => {
  // Public routes that don’t require auth
  const publicRoutes = [
    "/auth/register",
    "/auth/login",
    "/auth/verify-email",
    "/auth/forgot-password",
    "/auth/reset-password",
  ];
  const isPublic = publicRoutes.some((route) =>
    config.url?.startsWith(route)
  );

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

export default apiClient;

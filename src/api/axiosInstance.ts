// front_end/src/api/axiosInstance.ts
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

const baseURL = import.meta.env.VITE_API_URL;
if (!baseURL) throw new Error("Missing VITE_API_URL");

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true, // Required for cookie-based authentication
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  timeout: 10000,
});

// Refresh logic state
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: any) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error?: AxiosError, token?: string) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Skip auth for public routes
    const publicRoutes = [
      "/api/auth/register",
      "/api/auth/login",
      "/api/auth/verify-email",
      "/api/auth/forgot-password",
      "/api/auth/reset-password",
    ];

    const isPublic = publicRoutes.some((route) => config.url?.startsWith(route));

    if (!isPublic) {
      const token = localStorage.getItem("access_token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Fixed refresh endpoint URL
        const res = await axiosInstance.post("/api/auth/refresh", {}, { withCredentials: true });
        const { access_token } = res.data;
        localStorage.setItem("access_token", access_token);
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${access_token}`;
        processQueue(null, access_token);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.dispatchEvent(new Event("auth-unauthorized"));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle rate limits (429)
    if (error.response?.status === 429) {
      console.warn("Rate limit exceeded. Please try again later.");
      return Promise.reject(new Error("Too many requests. Please try again later."));
    }

    // Handle server errors (500)
    if (error.response?.status === 500) {
      console.error("Server error:", error.response.data);
      return Promise.reject(new Error("Internal server error. Please try again later."));
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
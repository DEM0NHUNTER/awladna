// front_end/src/api/axiosInstance.ts
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

// Validate base URL
const baseURL = import.meta.env.VITE_API_URL;
if (!baseURL) throw new Error("Missing VITE_API_URL");

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  withCredentials: false, // Match backend settings
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Access-Control-Allow-Origin": "*"
  },
  timeout: 10000
});

// Refresh logic state
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Clean up URL
    config.url = config.url?.trim();

    // Skip auth for public routes
    const publicRoutes = ["/auth/register", "/auth/login", "/auth/verify-email"];
    const isPublic = publicRoutes.some((route) => config.url?.includes(route));

    const token = localStorage.getItem("access_token");
    if (!isPublic && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("Request error:", error.message);
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.config.url, response.status);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    // Network error (e.g. server unreachable)
    if (!error.response) {
      console.error("Network error:", error.message);
      return Promise.reject(new Error("Network error. Please check your connection."));
    }

    // Handle 401 (Unauthorized) with refresh token logic
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh_token = localStorage.getItem("refresh_token");
      if (!refresh_token) {
        window.dispatchEvent(new Event("auth-unauthorized"));
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            },
            reject
          });
        });
      }

      isRefreshing = true;

      try {
        const res = await axios.post(
          `${baseURL}/auth/refresh-token`,
          { refresh_token },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
          }
        );

        const newAccessToken = res.data.access_token;
        localStorage.setItem("access_token", newAccessToken);

        axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.dispatchEvent(new Event("auth-unauthorized"));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle 500 Server Errors
    if (error.response?.status === 500) {
      console.error("Server error:", error.response.data);
      return Promise.reject(new Error("Internal server error. Please try again later."));
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;
if (!baseURL) throw new Error("Missing VITE_API_URL");

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",  // Explicit header
  },
  withCredentials: true,
});

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

// Add token to all outgoing requests (except public ones)
axiosInstance.interceptors.request.use((config) => {
  const publicRoutes = ["/auth/register", "/auth/login", "/auth/verify-email"];
  const isPublic = publicRoutes.some((route) => config.url?.includes(route));
  const token = localStorage.getItem("access_token");

  if (!isPublic && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle 401 responses and attempt refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh_token = localStorage.getItem("refresh_token");
      if (!refresh_token) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue other requests until refresh completes
        return new Promise(function (resolve, reject) {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            },
            reject: (err: any) => reject(err),
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
            withCredentials: true,
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
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

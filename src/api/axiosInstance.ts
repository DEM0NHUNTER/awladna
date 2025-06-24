import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;
if (!baseURL) throw new Error("Missing VITE_API_URL");

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});

apiClient.interceptors.request.use((config) => {
  const publicRoutes = ["/auth/register", "/auth/login", "/auth/verify-email"];
  const isPublic = publicRoutes.some((route) => config.url?.includes(route));

  if (!isPublic) {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default apiClient;

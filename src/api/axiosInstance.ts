import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL?.replace(/^http:\/\//, "https://") || "https://awladna-api-1017471338215.us-west1.run.app/api",
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});

// ✅ Attach Bearer token to all requests EXCEPT public ones
apiClient.interceptors.request.use((config) => {
  const publicRoutes = ["/auth/register", "/auth/login", "/auth/verify-email"];
  const isPublic = publicRoutes.some(route => config.url?.includes(route));

  if (!isPublic) {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default apiClient;

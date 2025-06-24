import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

// Define types for user and auth context
interface User {
  id: number;
  email: string;
  name?: string;
  picture?: string;
  is_verified: boolean;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Refresh user data
  const refreshUser = async () => {
    try {
      const response = await axiosInstance.get("/auth/me");
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
      try {
        const response = await axiosInstance.post("/auth/login", {
          email,
          password,
        });

        const { access_token } = response.data;
        localStorage.setItem("access_token", access_token);

        await refreshUser(); // Ensure user is loaded

        // Check email verification
        if (!response.data.is_verified) {
          navigate("/verify-email");
          return;
        }

        // ✅ Check if user has children
        const childrenRes = await axiosInstance.get("/child");
        const hasChildren = childrenRes.data.length > 0;

        // 🔁 Redirect accordingly
        if (!hasChildren) {
          navigate("/profile"); // Go create child profile
        } else {
          navigate("/chat"); // Go chat
        }

      } catch (error: any) {
        throw new Error(error.response?.data?.detail || "Login failed");
      }
    };

  // Register function
    const register = async (email: string, password: string, name?: string) => {
      try {
        const response = await axiosInstance.post("/auth/register", { email, password, name });
        const { access_token } = response.data;
        localStorage.setItem("access_token", access_token);

        navigate("/verify-email");  // ✅ Redirect to verification page
      } catch (error: any) {
        throw new Error(error.response?.data?.detail || "Registration failed");
      }
    };

  // Logout function
  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } finally {
      localStorage.removeItem("access_token");
      setUser(null);
      navigate("/");
    }
  };

  // Initialize auth state on mount
  useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem("access_token");
            if (token) {
                try {
                    await refreshUser(); // Only call /auth/me if token exists
                } catch {
                    localStorage.removeItem("access_token");
                    setUser(null);
                }
            }
            setLoading(false);
        };

        initializeAuth();
  }, []);

  // Provide auth context values
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
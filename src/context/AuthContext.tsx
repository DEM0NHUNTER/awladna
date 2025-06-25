import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const refreshUser = async () => {
    try {
      const response = await axiosInstance.get("/auth/me");
      setUser(response.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post("/auth/login", { email, password });
      const { access_token } = response.data;
      localStorage.setItem("access_token", access_token);

      await refreshUser();

      if (!response.data.is_verified) {
        navigate("/verify-email");
        return;
      }

      navigate("/chat");
    } catch (error: any) {
      console.error("Login error", error);
      throw new Error(error.response?.data?.detail || "Login failed");
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    try {
      const response = await axiosInstance.post("/auth/register", { email, password, name });
      const { access_token } = response.data;
      localStorage.setItem("access_token", access_token);
      navigate("/verify-email");
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Registration failed");
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } finally {
      localStorage.removeItem("access_token");
      setUser(null);
      navigate("/");
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          await refreshUser();
        } catch {
          localStorage.removeItem("access_token");
          setUser(null);
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const value = { user, loading, login, register, logout, refreshUser };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

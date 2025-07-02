// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { User } from "../types/user";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user from backend using token
  const refreshUser = async () => {
    try {
      const res = await axiosInstance.get("/auth/me"); // ensure backend has this endpoint
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      const token = res.data.access_token;

      // Store token and set header
      localStorage.setItem("access_token", token);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await refreshUser();
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed", err);
      throw err;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      await axiosInstance.post("/auth/register", { email, password });
      navigate("/login");
    } catch (err) {
      console.error("Registration failed", err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (err) {
      console.warn("Logout request failed", err);
    } finally {
      localStorage.removeItem("access_token");
      delete axiosInstance.defaults.headers.common["Authorization"];
      setUser(null);
      navigate("/login");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      refreshUser();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

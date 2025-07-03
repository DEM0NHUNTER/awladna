// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { User } from "../types/user";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  children: any[]; // ✅ Added children profiles
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshChildren: () => Promise<void>; // ✅ Added children refresher
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children: appChildren }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState<any[]>([]); // ✅ Children state
  const navigate = useNavigate();

  // ✅ Fetch user info from token
  const refreshUser = async () => {
    try {
      const res = await axiosInstance.get("/me");
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch child profiles
  const refreshChildren = async () => {
    try {
      const res = await axiosInstance.get("/auth/child/");
      setChildren(res.data);
    } catch (err) {
      console.error("Failed to fetch children:", err);
      setChildren([]);
    }
  };

  // ✅ Login and fetch user + children
  const login = async (email: string, password: string) => {
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      const token = res.data.access_token;

      // Store token and attach to headers
      localStorage.setItem("access_token", token);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await Promise.all([refreshUser(), refreshChildren()]);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed", err);
      throw err;
    }
  };

  // ✅ Register user
  const register = async (email: string, password: string) => {
    try {
      await axiosInstance.post("/auth/register", { email, password });
      navigate("/login");
    } catch (err) {
      console.error("Registration failed", err);
      throw err;
    }
  };

  // ✅ Logout
  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (err) {
      console.warn("Logout request failed", err);
    } finally {
      localStorage.removeItem("access_token");
      delete axiosInstance.defaults.headers.common["Authorization"];
      setUser(null);
      setChildren([]);
      navigate("/login");
    }
  };

  // ✅ On load, check token
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      Promise.all([refreshUser(), refreshChildren()]);
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        children, // ✅ Provided to consumer
        login,
        register,
        logout,
        refreshUser,
        refreshChildren, // ✅ Provided to consumer
      }}
    >
      {appChildren}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { User } from "../types/user";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  childProfiles: any[];                    // renamed
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshChildren: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [childProfiles, setChildProfiles] = useState<any[]>([]);
  const navigate = useNavigate();

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

  const refreshChildren = async () => {
    try {
      const res = await axiosInstance.get("/auth/child/");
      setChildProfiles(res.data);
    } catch (err) {
      console.error("Failed to fetch children:", err);
      setChildProfiles([]);
    }
  };

  const login = async (email: string, password: string) => {
    const res = await axiosInstance.post("/auth/login", { email, password });
    const token = res.data.access_token;
    localStorage.setItem("access_token", token);
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await Promise.all([refreshUser(), refreshChildren()]);
    navigate("/dashboard");
  };

  const register = async (email: string, password: string) => {
    await axiosInstance.post("/auth/register", { email, password });
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
      setChildProfiles([]);
      navigate("/login");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const initialize = async () => {
      if (token) {
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        await Promise.all([refreshUser(), refreshChildren()]);
      } else {
        setLoading(false);
      }
    };
    initialize();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        childProfiles,
        login,
        register,
        logout,
        refreshUser,
        refreshChildren,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

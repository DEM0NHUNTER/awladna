import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { User } from "../types/user";
import { ChildProfile } from "../types/chat";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  children: ChildProfile[];
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
  const [childrenProfiles, setChildrenProfiles] = useState<ChildProfile[]>([]);
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
      setChildrenProfiles(res.data);
    } catch (err) {
      console.error("Failed to fetch children:", err);
      setChildrenProfiles([]);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      const token = res.data.access_token;

      localStorage.setItem("access_token", token);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await Promise.all([refreshUser(), refreshChildren()]);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed", err);
      throw err;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      await axiosInstance.post("/auth/register", { email, password });
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
      setChildrenProfiles([]);
      navigate("/login");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const initialize = async () => {
      if (token) {
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer token`;
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
        children: childrenProfiles,
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
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

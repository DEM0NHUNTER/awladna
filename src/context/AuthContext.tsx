import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

interface User {
  email: string;
  name?: string;
  picture?: string;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/auth/me");
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    await axiosInstance.post("/auth/login", { username: email, password });
    await refreshUser();
  };

  const register = async (email: string, password: string, name?: string) => {
    await axiosInstance.post("/auth/register", { email, password, name });
    await refreshUser();
  };

  const logout = async () => {
    await axiosInstance.post("/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refreshUser }}
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

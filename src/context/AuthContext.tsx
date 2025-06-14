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
    const response = await axiosInstance.post("/auth/login", {
        username: email,
        password,
    });

    const token = response.data.access_token;
    if (token) {
        localStorage.setItem("access_token", token); // 🔐 Save it
    }

    await refreshUser(); // 🚀 This will now work because token is present
  };


  const register = async (email: string, password: string, name?: string) => {
    const response = await axiosInstance.post("/auth/register", {
        email,
        password,
        name,
    });

      const token = response.data.access_token;
      if (token) {
        localStorage.setItem("access_token", token);
      }

    await refreshUser();
  };


  const logout = async () => {
    await axiosInstance.post("/auth/logout");
    localStorage.removeItem("access_token"); // 🔒 Clear the token
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

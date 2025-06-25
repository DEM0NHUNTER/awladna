import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

// Types from your backend schema
interface ChildProfileResponse {
  child_id: number;
  name: string;
  age: number;
  gender: string;
  created_at: string;
}

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
  children: ChildProfileResponse[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children: AppChildren }) => {
  const [user, setUser] = useState<User | null>(null);
  const [childProfiles, setChildProfiles] = useState<ChildProfileResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
    const [children, setChildren] = useState<ChildProfileResponse[]>([]);

  const refreshUser = async () => {
    try {
      const response = await axiosInstance.get("/auth/me");
      setUser(response.data);
      return response.data;
    } catch (error) {
      setUser(null);
      return null;
    }
  };

  const fetchChildren = async () => {
    try {
      const res = await axiosInstance.get("/auth/child");
      setChildren(res.data);
      return res.data;
    } catch (error) {
      setChildren([]);
      return [];
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post("/auth/login", { email, password });
      const { access_token } = response.data;
      localStorage.setItem("access_token", access_token);

      // Refresh user and fetch children in parallel
      const [userData, childrenData] = await Promise.all([
        refreshUser(),
        fetchChildren()
      ]);

      const currentUser = userData || user;
      const currentChildren = childrenData || children;

      if (!currentUser?.is_verified) {
        navigate("/verify-email");
        return;
      }

      // Navigate based on children existence
      if (currentChildren.length > 0) {
        navigate(`/chat/${currentChildren[0].child_id}`);
      } else {
        navigate("/profile");
      }
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
      setChildren([]);
      navigate("/");
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          await Promise.all([
            refreshUser(),
            fetchChildren()
          ]);
        } catch (error) {
          localStorage.removeItem("access_token");
          setUser(null);
          setChildren([]);
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
    children: childProfiles // use renamed state
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && <AppChildren />}
    </AuthContext.Provider>
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
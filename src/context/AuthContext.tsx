// front_end/src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

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
  getChildProfiles: () => Promise<any[]>;
  childProfiles: any[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [childProfiles, setChildProfiles] = useState<any[]>([]);
  const navigate = useNavigate();

  const refreshUser = async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      setUser(res.data);
      if (res.data.email) {
        const profiles = await getChildProfiles();
        setChildProfiles(profiles);
      }
    } catch {
      setUser(null);
      setChildProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  const getChildProfiles = async () => {
    try {
      const res = await axiosInstance.get("/auth/child/");
      setChildProfiles(res.data);
      return res.data;
    } catch (error) {
      console.error("Failed to fetch child profiles:", error);
      return [];
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      const { access_token } = res.data;
      localStorage.setItem("access_token", access_token);
      await refreshUser();

      if (!res.data.is_verified) {
//         navigate("/verify-email");
        return;
      }

      const profiles = await getChildProfiles();
      if (profiles.length > 0) {
        navigate(`/auth/chat/${profiles[0].id}`);
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
      const res = await axiosInstance.post("/auth/register", { email, password, name });
      const { access_token } = res.data;
      localStorage.setItem("access_token", access_token);
//       navigate("/verify-email");
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
      setChildProfiles([]);
      navigate("/");
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        await refreshUser();
      } else {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refreshUser, getChildProfiles, childProfiles }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

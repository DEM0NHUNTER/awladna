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
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
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

  // ✅ Fetch authenticated user and child profiles
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

  // ✅ Child profile loader
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

  // ✅ Login (do not touch tokens, just refresh state)
  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        username: email,
        password,
      });

      await refreshUser();
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.detail || "Login failed",
      };
    }
  };

  // ✅ Register without storing tokens directly
  const register = async (email: string, password: string, name?: string) => {
    try {
      await axiosInstance.post("/auth/register", { email, password, name });
      // Optionally: navigate("/verify-email");
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Registration failed");
    }
  };

  // ✅ Logout (state-only)
  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      setUser(null);
      setChildProfiles([]);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // ✅ On first mount: restore session
  useEffect(() => {
    refreshUser();
  }, []);

  // ✅ Listen for refresh event (emitted from axios interceptor)
  useEffect(() => {
    const handleRefetch = () => {
      refreshUser();
    };
    window.addEventListener("auth-token-refreshed", handleRefetch);
    return () => {
      window.removeEventListener("auth-token-refreshed", handleRefetch);
    };
  }, []);

  // ✅ Listen for unauthorized and redirect to login
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setChildProfiles([]);
      navigate("/login");
    };
    window.addEventListener("auth-unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("auth-unauthorized", handleUnauthorized);
    };
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
        getChildProfiles,
        childProfiles,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

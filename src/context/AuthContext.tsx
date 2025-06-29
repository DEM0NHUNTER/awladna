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

  // ✅ Login: store tokens and refresh state
  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      const { access_token, refresh_token } = response.data;

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      await refreshUser();
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.detail || "Login failed",
      };
    }
  };

  // ✅ Register without token logic
  const register = async (email: string, password: string, name?: string) => {
    try {
      await axiosInstance.post("/auth/register", { email, password, name });
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Registration failed");
    }
  };

  // ✅ Logout: clear state + tokens
  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
      setChildProfiles([]);
    }
  };

  // ✅ On first load: restore session if tokens exist
    useEffect(() => {
      const accessToken = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");

      // ✅ Only fetch user if both tokens exist and are non-empty strings
      if (typeof accessToken === "string" && typeof refreshToken === "string" &&
          accessToken.length > 10 && refreshToken.length > 10) {
        refreshUser();
      } else {
        // ✅ No tokens → guest mode
        setLoading(false);
      }
    }, []);

  // ✅ Listen for token refresh events
  useEffect(() => {
    const handleRefetch = () => {
      refreshUser();
    };
    window.addEventListener("auth-token-refreshed", handleRefetch);
    return () => {
      window.removeEventListener("auth-token-refreshed", handleRefetch);
    };
  }, []);

  // ✅ Handle 401 → redirect to login
  useEffect(() => {
    const handleUnauthorized = () => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
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

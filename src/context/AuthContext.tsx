import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

// Define types for user and auth context
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
  mockLogout: () => void; // Add mock logout for testing
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for testing
const MOCK_USER: User = {
  id: 1,
  email: "test@example.com",
  name: "Test User",
  picture: "",
  is_verified: true,
  role: "parent"
};

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(MOCK_USER); // Start with mock user
  const [loading, setLoading] = useState<boolean>(false); // No loading needed
  const navigate = useNavigate();

  // Refresh user data - mock implementation
  const refreshUser = async () => {
    // Mock implementation - always return mock user
    setUser(MOCK_USER);
      setLoading(false);
  };

  // Login function - mock implementation
  const login = async (email: string, password: string) => {
    // Mock successful login
    setUser(MOCK_USER);
    localStorage.setItem("access_token", "mock-token");
    navigate("/chat"); // Navigate to chat after login
    };

  // Register function - mock implementation
    const register = async (email: string, password: string, name?: string) => {
    // Mock successful registration
    setUser(MOCK_USER);
    localStorage.setItem("access_token", "mock-token");
    navigate("/chat"); // Navigate to chat after registration
    };

  // Logout function - mock implementation
  const logout = async () => {
      localStorage.removeItem("access_token");
      setUser(null);
      navigate("/");
  };

  // Mock logout for testing
  const mockLogout = () => {
                    localStorage.removeItem("access_token");
                    setUser(null);
    navigate("/");
  };

  // Initialize auth state on mount - mock implementation
  useEffect(() => {
    // Always set mock user for testing
    setUser(MOCK_USER);
    setLoading(false);
  }, []);

  // Provide auth context values
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
    mockLogout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
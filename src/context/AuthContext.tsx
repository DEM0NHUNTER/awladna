import React, { createContext, useState, useEffect } from "react";
import apiClient from "@/services/api";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("auth_token") || "");
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const response = await apiClient.post("/auth/login", { email, password });
    const { access_token } = response.data;
    setToken(access_token);
    localStorage.setItem("auth_token", access_token);
    const decoded = JSON.parse(atob(access_token.split(".")[1]));
    setUser(decoded);
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("auth_token");
  };

  useEffect(() => {
    if (token) {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setUser(decoded);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
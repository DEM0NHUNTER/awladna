import { useState, useEffect } from 'react';
import { login, register } from '../services/api';

interface User {
  email: string;
  role: string;
  created_at: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Implement token validation logic
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const data = await login(email, password);
      setToken(data.access_token);
      localStorage.setItem('token', data.access_token);
      setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const handleRegister = async (email: string, password: string) => {
    try {
      const data = await register(email, password);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return {
    user,
    token,
    loading,
    login: handleLogin,
    register: handleRegister,
    logout
  };
};
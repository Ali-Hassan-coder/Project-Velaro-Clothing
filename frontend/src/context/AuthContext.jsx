import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('velaro_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('velaro_token');
      if (token) {
        try {
          const res = await authApi.getMe();
          if (res.data?.success) {
            setUser(res.data.data.user);
            localStorage.setItem('velaro_user', JSON.stringify(res.data.data.user));
          }
        } catch {
          localStorage.removeItem('velaro_token');
          localStorage.removeItem('velaro_user');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res.data?.success) {
      const { user: loggedInUser, accessToken } = res.data.data;
      localStorage.setItem('velaro_token', accessToken);
      localStorage.setItem('velaro_user', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      return loggedInUser;
    }
    throw new Error(res.data?.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    if (res.data?.success) {
      const { user: newUser, accessToken } = res.data.data;
      localStorage.setItem('velaro_token', accessToken);
      localStorage.setItem('velaro_user', JSON.stringify(newUser));
      setUser(newUser);
      return newUser;
    }
    throw new Error(res.data?.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('velaro_token');
    localStorage.removeItem('velaro_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

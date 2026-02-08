// frontend/src/context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getToken, setToken, removeToken, isAuthenticated as isAuthenticatedUtil, getUserIdFromToken } from '../lib/auth';
import { authAPI } from '../lib/api';

interface AuthContextType {
  user: any | null;
  token: string | null;
  userId: number | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, name: string, password: string) => Promise<boolean>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setAuthToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in on initial load
    const storedToken = getToken();
    if (storedToken) {
      setAuthToken(storedToken);
      // Decode token to get user info
      try {
        const decoded = JSON.parse(atob(storedToken.split('.')[1]));
        setUser({ id: decoded.sub, email: decoded.email }); // Simplified user object
      } catch (error) {
        console.error('Error decoding token:', error);
        // If token is invalid, remove it
        removeToken();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.login(email, password);

      if (response.status === 200) {
        const { access_token, user } = response.data.data;

        // Store token
        setToken(access_token);
        setAuthToken(access_token);
        setUser(user);

        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (email: string, name: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.register(email, name, password);

      if (response.status === 200) {
        const { access_token, user } = response.data.data;

        // Store token
        setToken(access_token);
        setAuthToken(access_token);
        setUser(user);

        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    removeToken();
    setAuthToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    userId: getUserIdFromToken(),
    login,
    logout,
    register,
    isAuthenticated: isAuthenticatedUtil(),
  };

  if (loading) {
    return <div>Loading...</div>; // Simple loading indicator
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
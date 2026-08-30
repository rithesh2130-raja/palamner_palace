import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCurrentUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.getMe();
      if (res && res.success && res.data?.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (credentials) => {
    setError(null);
    try {
      const res = await authService.login(credentials);
      if (res && res.success && res.data?.user) {
        setUser(res.data.user);
        return res.data;
      }
      throw new Error(res?.error?.message || 'Login failed.');
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const res = await authService.register(userData);
      if (res && res.success && res.data?.user) {
        setUser(res.data.user);
        return res.data;
      }
      throw new Error(res?.error?.message || 'Registration failed.');
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  };

  const updateProfile = async (data) => {
    setError(null);
    try {
      const res = await authService.updateProfile(data);
      if (res && res.success && res.data?.user) {
        setUser(res.data.user);
        return res.data;
      }
      throw new Error(res?.error?.message || 'Failed to update profile.');
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoggedIn: isAuthenticated,
        loading,
        isLoading: loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        refreshUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

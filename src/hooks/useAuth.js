import { useState, useEffect } from 'react';
import ApiService from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      verifyToken(token);
    }
  }, []);

  // Verify token with backend
  const verifyToken = async (token) => {
    setLoading(true);
    const result = await ApiService.verifyToken(token);
    
    if (result.success) {
      setUser(result.data.user);
    } else {
      localStorage.removeItem('authToken');
      setUser(null);
    }
    setLoading(false);
  };

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    const result = await ApiService.login(email, password);

    if (result.success) {
      // Store token in localStorage
      localStorage.setItem('authToken', result.data.token);
      setUser(result.data.user);
      return { success: true, message: result.message };
    } else {
      setError(result.error);
      return { success: false, message: result.message, error: result.error };
    }

    setLoading(false);
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    setError(null);

    const result = await ApiService.register(userData);

    if (result.success) {
      // Store token in localStorage
      localStorage.setItem('authToken', result.data.token);
      setUser(result.data.user);
      return { success: true, message: result.message };
    } else {
      setError(result.error);
      return { success: false, message: result.message, error: result.error };
    }

    setLoading(false);
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    const token = localStorage.getItem('authToken');
    
    if (token) {
      await ApiService.logout(token);
    }
    
    localStorage.removeItem('authToken');
    setUser(null);
    setError(null);
    setLoading(false);
  };

  // Forgot password function
  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);

    const result = await ApiService.forgotPassword(email);

    if (result.success) {
      return { success: true, message: result.message };
    } else {
      setError(result.error);
      return { success: false, message: result.message, error: result.error };
    }

    setLoading(false);
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    isAuthenticated: !!user
  };
};

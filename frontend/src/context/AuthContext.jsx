import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create axios instance with base URL
  const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Set auth token in headers
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // Check if user is logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        // Try to get user profile first
        try {
          const response = await api.get('/users/profile');
          setUser(response.data);
        } catch (userError) {
          // If user profile fails, try admin profile
          try {
            const adminResponse = await api.get('/admin/profile');
            setUser(adminResponse.data);
          } catch (adminError) {
            // If both fail, clear auth
            console.error('Auth check failed:', adminError);
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // User registration
  const register = async (name, email, password, mobile) => {
    try {
      setError(null);
      const response = await api.post('/users/signup', {
        name,
        email,
        password,
        phone: mobile
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      return user;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    }
  };

  // User login
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await api.post('/users/login', {
        email,
        password
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      return user;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      setError(message);
      throw new Error(message);
    }
  };

  // Admin login
  const adminLogin = async (email, password) => {
    try {
      setError(null);
      const response = await api.post('/admin/login', {
        email,
        password
      });

      const { token, admin } = response.data;
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(admin);
      return admin;
    } catch (error) {
      const message = error.response?.data?.message || 'Admin login failed';
      setError(message);
      throw new Error(message);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // Update profile
  const updateProfile = async (updates) => {
    try {
      setError(null);
      const response = await api.patch('/users/profile', updates);
      setUser(response.data);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      setError(message);
      throw new Error(message);
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      await api.post('/users/change-password', {
        currentPassword,
        newPassword
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed';
      setError(message);
      throw new Error(message);
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    adminLogin,
    logout,
    updateProfile,
    changePassword,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
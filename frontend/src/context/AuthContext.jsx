import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/axios';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for token in cookies
    const token = Cookies.get('token');
    const userData = Cookies.get('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Clear invalid cookies
        Cookies.remove('token');
        Cookies.remove('user');
      }
    }
    setLoading(false);
  }, []);

  const register = async (userData) => {
    try {
      setError(null);
      let endpoint = '/api/recruiters/register';
      
      if (userData.role === 'user') {
        endpoint = '/api/users/register';
      } else if (userData.role === 'admin') {
        endpoint = '/api/admin/register';
      }
      
      const response = await api.post(endpoint, userData);
      const { token, ...userInfo } = response.data;
      
      // Store token in cookie
      Cookies.set('token', token, { 
        expires: 7, // 7 days
        secure: true,
        sameSite: 'strict'
      });
      
      // Store user info in cookie
      Cookies.set('user', JSON.stringify(userInfo), {
        expires: 7,
        secure: true,
        sameSite: 'strict'
      });
      
      setUser(userInfo);
      return userInfo;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  const login = async (email, password, role) => {
    try {
      setError(null);
      let endpoint = '/api/recruiters/login';
      
      if (role === 'admin') {
        endpoint = '/api/admin/login';
      } else if (role === 'user') {
        endpoint = '/api/users/login';
      }
      
      const response = await api.post(endpoint, { email, password });
      const { token, user: userInfo } = response.data;
      
      // Store token in cookie
      Cookies.set('token', token, {
        expires: 7,
        secure: true,
        sameSite: 'strict'
      });
      
      // Ensure userInfo has the correct role
      const userData = {
        ...userInfo,
        role: role // Ensure role is set correctly
      };
      
      // Store user info in cookie
      Cookies.set('user', JSON.stringify(userData), {
        expires: 7,
        secure: true,
        sameSite: 'strict'
      });
      
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const adminLogin = async (email, password) => {
    try {
      setError(null);
      const response = await api.post('/api/admin/login', { email, password });
      const { token, admin } = response.data;
      
      // Store token in cookie
      Cookies.set('token', token, {
        expires: 7,
        secure: true,
        sameSite: 'strict'
      });
      
      // Store admin info in cookie
      const userInfo = { ...admin, role: 'admin' };
      Cookies.set('user', JSON.stringify(userInfo), {
        expires: 7,
        secure: true,
        sameSite: 'strict'
      });
      
      setUser(userInfo);
      return userInfo;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Admin login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    // Remove cookies
    Cookies.remove('token');
    Cookies.remove('user');
    setUser(null);
  };

  const updateProfile = async (userData) => {
    try {
      setError(null);
      const response = await api.put('/api/recruiters/profile', userData);
      
      const updatedUser = { ...user, ...response.data };
      // Update user cookie
      Cookies.set('user', JSON.stringify(updatedUser), {
        expires: 7,
        secure: true,
        sameSite: 'strict'
      });
      
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.response?.data?.message || 'Profile update failed');
      throw err;
    }
  };

  const clearError = () => setError(null);

  const updateAdminProfile = async ({ name, email }) => {
    try {
      setError(null);
      const response = await api.put('/api/admin/profile', { name, email });
      
      const updatedUser = { ...user, ...response.data };
      // Update user cookie
      Cookies.set('user', JSON.stringify(updatedUser), {
        expires: 7,
        secure: true,
        sameSite: 'strict'
      });
      
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateAdminPassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      await api.put('/api/admin/password', { currentPassword, newPassword });
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update password';
      setError(errorMessage);
      throw new Error(errorMessage);
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
    clearError,
    updateAdminProfile,
    updateAdminPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
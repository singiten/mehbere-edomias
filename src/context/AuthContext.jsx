// context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error loading user:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  // ✅ ADD THIS: Register function
  const register = async (userData) => {
    try {
      console.log('📝 AuthContext: Register attempt with:', userData);
      
      const response = await auth.register(userData);
      console.log('📝 AuthContext: Register response:', response);
      
      return response;
    } catch (error) {
      console.error('❌ AuthContext: Register error:', error);
      console.error('❌ AuthContext: Error response:', error.response?.data);
      throw error;
    }
  };

  const login = async (phoneNumber, password) => {
    try {
      console.log('🔐 AuthContext: Login attempt with:', phoneNumber);
      
      const response = await auth.login({ phoneNumber, password });
      console.log('🔐 AuthContext: Login response:', response);
      
      // Extract data from response
      const data = response.data || response;
      const userData = data.user || data;
      const tokenData = data.token || response.token;
      
      console.log('🔐 AuthContext: User data:', userData);
      console.log('🔐 AuthContext: Token:', tokenData);
      
      // Store token and user
      if (tokenData) {
        localStorage.setItem('token', tokenData);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(tokenData);
        setUser(userData);
      } else {
        throw new Error('No token received from server');
      }
      
      return { user: userData, token: tokenData };
      
    } catch (error) {
      console.error('❌ AuthContext: Login error:', error);
      console.error('❌ AuthContext: Error response:', error.response?.data);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  // ✅ ADD THIS: Register to the value object
  const value = {
    user,
    token,
    register,  // ← Make sure this is here
    login,
    logout,
    loading,
    isAuthenticated: !!token && !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        const refresh = await AsyncStorage.getItem('refresh_token');

        if (token) {
          setAccessToken(token);
          setIsAuthenticated(true);
        } else if (refresh) {
          const newToken = await refreshAccessToken(refresh);
          if (newToken) {
            setAccessToken(newToken);
            setIsAuthenticated(true);
          } else {
            await logout();
          }
        }
      } catch (e) {
        console.error('Initialization error:', e);
        await logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (access, refresh) => {
    try {
      // Save or remove access_token safely
      if (access != null) {
        await AsyncStorage.setItem('access_token', access);
        setAccessToken(access);
      } else {
        await AsyncStorage.removeItem('access_token');
        setAccessToken(null);
      }

      // Save or remove refresh_token safely
      if (refresh != null) {
        await AsyncStorage.setItem('refresh_token', refresh);
      } else {
        await AsyncStorage.removeItem('refresh_token');
      }

      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login storage error:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('refresh_token');
      setAccessToken(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshAccessToken = async (refreshToken) => {
    try {
      const response = await axios.post('https://yourapi.com/refresh', {
        refresh_token: refreshToken,
      });

      const newToken = response.data.access_token;
      await AsyncStorage.setItem('access_token', newToken);
      return newToken;
    } catch (e) {
      console.error('Failed to refresh token:', e);
      return null;
    }
  };

  const getAuthHeaders = () => {
    return {
      Authorization: `Bearer ${accessToken}`,
    };
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        login,
        logout,
        getAuthHeaders,
        accessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
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
            logout();
          }
        }
      } catch (e) {
        console.error('Initialization error:', e);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (access, refresh) => {
    await AsyncStorage.setItem('access_token', access);
    await AsyncStorage.setItem('refresh_token', refresh);
    setAccessToken(access);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    setAccessToken(null);
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

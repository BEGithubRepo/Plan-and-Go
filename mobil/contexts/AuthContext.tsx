import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../utils/ApiService';
import { router } from 'expo-router';

interface AuthContextType {
  user: any;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  resetPassword: (userData: any) => Promise<any>;
  confirmResetPassword: (data: any) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is logged in on initial load
    const loadUserFromStorage = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const userString = await AsyncStorage.getItem('user');
        
        if (accessToken && userString) {
          setUser(JSON.parse(userString));
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserFromStorage();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authApi.login(username, password);
      
      if (response.status === 'success') {
        await AsyncStorage.setItem('accessToken', response.access);
        await AsyncStorage.setItem('refreshToken', response.refresh);
        
        if (response.user) {
          await AsyncStorage.setItem('user', JSON.stringify(response.user));
          setUser(response.user);
        }
        
        setIsLoggedIn(true);
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setIsLoading(true);
      const response = await authApi.register(userData);
      
      if (response.status === 'success') {
        // After registration, navigate to login
        router.replace('/login');
        return response;
      }
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      // Clear all tokens and user data
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('user');
      
      setUser(null);
      setIsLoggedIn(false);
      
      // Navigate to login screen
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (userData: any) => {
    try {
      const response = await authApi.resetPassword(userData);
      return response;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  const confirmResetPassword = async (data: any) => {
    try {
      const response = await authApi.confirmResetPassword(data);
      return response;
    } catch (error) {
      console.error('Confirm reset password error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLoggedIn,
        login,
        register,
        logout,
        resetPassword,
        confirmResetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
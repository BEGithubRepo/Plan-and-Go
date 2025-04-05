import React, { useState, useEffect, createContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';
import axios from 'axios';

// API base URL (Django backend'inizin adresini yazın)
axios.defaults.baseURL = 'http://127.0.0.1:8000/api/';

// Auth Context
export const AuthContext = createContext();

const Stack = createStackNavigator();

export default function App() {
  const [userToken, setUserToken] = useState(null);

  const authContext = {
    signIn: async (email, password) => {
      try {
        const response = await axios.post('auth/login/', { email, password });
        setUserToken(response.data.access);
      } catch (error) {
        console.error('Giriş hatası:', error.response.data);
      }
    },
    signUp: async (email, password) => {
      try {
        await axios.post('auth/register/', { email, password });
        alert('Kayıt başarılı! Giriş yapabilirsiniz.');
      } catch (error) {
        console.error('Kayıt hatası:', error.response.data);
      }
    },
    signOut: () => setUserToken(null),
  };

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          userToken ? (
            <Stack.Screen name="Profile" component={ProfileScreen} />
          ) : (
            <Stack.Screen name="Login" component={LoginScreen} />
          )
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
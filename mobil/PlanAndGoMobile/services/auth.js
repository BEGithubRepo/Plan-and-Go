import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authApi = axios.create({
  baseURL: 'https://your-api-domain.com/auth/',
});

export const AuthService = {
  async login(email, password) {
    const { data } = await authApi.post('login/', { email, password });
    await AsyncStorage.setItem('userToken', data.access);
    await AsyncStorage.setItem('refreshToken', data.refresh);
    return data;
  },

  async register(userData) {
    return authApi.post('register/', userData);
  },

  async logout() {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('refreshToken');
  },

  async refreshToken() {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const { data } = await authApi.post('refresh/', { refresh: refreshToken });
    await AsyncStorage.setItem('userToken', data.access);
    return data.access;
  },

  async getCurrentUser() {
    const token = await AsyncStorage.getItem('userToken');
    const { data } = await authApi.get('me/', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  }
};
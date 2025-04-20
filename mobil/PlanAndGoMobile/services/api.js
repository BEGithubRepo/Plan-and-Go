import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'https://your-django-domain.com/api/',
});

// Token interceptors
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const RouteService = {
  async getAllRoutes() {
    return api.get('routes/');
  },

  async createRoute(data) {
    return api.post('routes/', data);
  },

  async updateRoute(id, data) {
    return api.patch(`routes/${id}/`, data);
  },
};
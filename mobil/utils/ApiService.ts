import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://127.0.0.1:8000';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (!refreshToken) {
          // If there's no refresh token, redirect to login
          return Promise.reject(error);
        }
        
        // Call refresh token API (you'd need to implement this endpoint)
        const response = await axios.post(`${BASE_URL}/api/auth/token/refresh/`, {
          refresh: refreshToken,
        });
        
        // Save the new tokens
        const { access } = response.data;
        await AsyncStorage.setItem('accessToken', access);
        
        // Update the authorization header
        originalRequest.headers.Authorization = `Bearer ${access}`;
        
        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh token is invalid, clear tokens and redirect to login
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (username: string, password: string) => {
    try {
      const response = await apiClient.post('/api/auth/login/', { username, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  register: async (userData: any) => {
    try {
      const response = await apiClient.post('/api/auth/register/', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  resetPassword: async (userData: any) => {
    try {
      const response = await apiClient.post('/api/auth/password/reset/', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  confirmResetPassword: async (data: any) => {
    try {
      const response = await apiClient.post('/api/auth/password/confirm/', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const profileApi = {
  getProfile: async () => {
    try {
      const response = await apiClient.get('/api/profile/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const badgeApi = {
  getBadges: async () => {
    try {
      const response = await apiClient.get('/api/user/badges/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getBadgeDetail: async (badgeId: number) => {
    try {
      const response = await apiClient.get(`/api/user/badges/${badgeId}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const routeApi = {
  getRoutes: async () => {
    try {
      const response = await apiClient.get('/routes/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  createRoute: async (routeData: any) => {
    try {
      const response = await apiClient.post('/routes/', routeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const notificationService = {
  
  getNotifications: async () => {
    try {
      const response = await apiClient.get('notifications/');
      return response.data;
    } catch (error) {
      console.error('Bildirimler alınamadı:', error);
      throw error;
    }
  },

  markAsRead: async (notificationId: any) => {
    try {
      await apiClient.patch(`notifications/${notificationId}/mark-as-read/`);
    } catch (error) {
      console.error('Okundu işaretlenemedi:', error);
      throw error;
    }
  },

  createNotification: async (payload: any) => {
    try {
      const response = await apiClient.post('notifications/', payload);
      return response.data;
    } catch (error) {
      console.error('Bildirim oluşturulamadı:', error);
      throw error;
    }
  }

};



export const FeedbackService = {
  submitFeedback: async (message: any, routeId: any, travelBuddyId: any) => {
    try {
      const payload = {
        message,
        route: routeId,
        travel_buddy: travelBuddyId
      };
      
      const response = await apiClient.post('feedback/', payload);
      return response.data;
    } catch (error) {
      console.error('Geri bildirim gönderilemedi:', error);
      throw error;
    }
  }
  
};
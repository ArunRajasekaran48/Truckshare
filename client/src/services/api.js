import axios from 'axios';
import { formatBackendError } from '@/utils/errors';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9191';
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 30000;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: Number(API_TIMEOUT),
  headers: { 'Content-Type': 'application/json' },
});

// Attach auth headers on every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');

    if (token) config.headers.Authorization = `Bearer ${token}`;
    if (userId) config.headers.UserId = userId;
    if (userRole) config.headers.UserRole = userRole;

    return config;
  },
  (error) => Promise.reject(error)
);

// Global response error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
    }

    const message = formatBackendError(error);

    return Promise.reject({ 
      status: error.response?.status, 
      message, 
      originalMessage: error.response?.data?.message || error.message,
      data: error.response?.data 
    });
  }
);

export default apiClient;

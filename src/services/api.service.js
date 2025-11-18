// src/services/api.service.js
import axios from 'axios';
import { getToken, removeToken, getRefreshToken } from '../utils/auth.utils';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,                   // ← agrega esto
});

// =============================
// 🔵 INTERCEPTOR DE REQUEST
// =============================
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 🚨 IMPORTANTE: si la petición pide BLOB → NO poner Content-Type
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =============================
// 🔵 INTERCEPTOR DE RESPUESTAS
// =============================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();

        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem('access_token', access);

          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        removeToken();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;

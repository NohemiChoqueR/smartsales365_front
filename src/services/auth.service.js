// src/services/auth.service.js
import api from './api.service';
import { setToken, removeToken, getToken } from '../utils/auth.utils';

export const authService = {
  // Login
  async login(email, password) {
    const response = await api.post('/auth/login/', {
      email,
      password
    });
    
    if (response.data.access) {
      setToken(response.data.access, response.data.refresh);
    }
    
    return response.data;
  },

  // Logout - CORREGIDO: ahora llama al backend
  async logout() {
    try {
      // Solo intenta hacer logout en el backend si hay un token
      const token = getToken();
      if (token) {
        await api.post('/auth/logout/');
      }
    } catch (error) {
      console.warn('Error durante logout:', error);
      // Si falla el logout del backend, limpiamos el frontend igual
    } finally {
      removeToken();
    }
  },

  // Refresh token
  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) throw new Error('No refresh token');
    
    const response = await api.post('/auth/refresh/', {
      refresh: refreshToken
    });
    
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
    }
    
    return response.data;
  },

  // Verificar autenticación
  async verifyToken() {
    const response = await api.post('/auth/verify/');
    return response.data;
  },
  async register(userData) {
    // URL de registro: http://127.0.0.1:8000/api/auth/register/
    const response = await api.post('/auth/register/', userData);
    return response.data;
  },
};
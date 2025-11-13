// src/hooks/useAuth.js
import { useState, useEffect, createContext, useContext } from 'react';
import { authService } from '../services/auth.service';
import { isAuthenticated, getUserFromToken } from '../utils/auth.utils';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (isAuthenticated()) {
        const userData = getUserFromToken();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      await logout(); // Usamos logout async para limpiar todo
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const userData = getUserFromToken();
      setUser(userData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // CORREGIDO: logout async que llama al backend
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.warn('Error durante logout:', error);
    } finally {
      setUser(null);
      window.location.href = '/home';
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
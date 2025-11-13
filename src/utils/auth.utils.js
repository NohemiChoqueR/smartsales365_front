// src/utils/auth.utils.js

// Tokens
export const getToken = () => localStorage.getItem('access_token');
export const getRefreshToken = () => localStorage.getItem('refresh_token');
export const setToken = (access, refresh) => {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
};
export const removeToken = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

// Verificar autenticación
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    // Decodificar el token para verificar expiración
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

// Obtener datos del usuario del token
export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.user_id,
      email: payload.email,
      role: payload.role,
      nombre: payload.nombre,
      apellido: payload.apellido
    };
  } catch {
    return null;
  }
};
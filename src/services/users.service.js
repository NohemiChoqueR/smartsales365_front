// src/services/users.service.js
import api from './api.service';

export const usersService = {
  // Obtener todos los usuarios
  async getUsers() {
    const response = await api.get('/users/');
    return response.data;
  },

  // Obtener usuario por ID
  async getUserById(id) {
    const response = await api.get(`/users/${id}/`);
    return response.data;
  },

  // Crear usuario
  async createUser(userData) {
    const response = await api.post('/users/', userData);
    return response.data;
  },

  // Actualizar usuario
  async updateUser(id, userData) {
    const response = await api.put(`/users/${id}/`, userData);
    return response.data;
  },

  // Eliminar usuario
  async deleteUser(id) {
    const response = await api.delete(`/users/${id}/`);
    return response.data;
  }
};
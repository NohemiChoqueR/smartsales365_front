// src/services/roles.service.js
import api from './api.service';

export const rolesService = {
  // Obtener todos los roles
  async getRoles() {
    const response = await api.get('/roles/');
    return response.data;
  },

  // Obtener rol por ID
  async getRoleById(id) {
    const response = await api.get(`/roles/${id}/`);
    return response.data;
  },

  // Crear rol
  async createRole(roleData) {
    const response = await api.post('/roles/', roleData);
    return response.data;
  },

  // Actualizar rol
  async updateRole(id, roleData) {
    const response = await api.put(`/roles/${id}/`, roleData);
    return response.data;
  },

  // Eliminar rol
  async deleteRole(id) {
    const response = await api.delete(`/roles/${id}/`);
    return response.data;
  }
};
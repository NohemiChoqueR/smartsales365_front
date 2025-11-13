// src/services/permissions.service.js
import api from './api.service';

export const permissionsService = {
  // Obtener todos los permisos
  async getPermissions() {
    const response = await api.get('/permissions/');
    return response.data;
  },

  // Obtener permiso por ID
  async getPermissionById(id) {
    const response = await api.get(`/permissions/${id}/`);
    return response.data;
  },

  // Crear permiso
  async createPermission(permissionData) {
    const response = await api.post('/permissions/', permissionData);
    return response.data;
  },

  // Actualizar permiso
  async updatePermission(id, permissionData) {
    const response = await api.put(`/permissions/${id}/`, permissionData);
    return response.data;
  },

  // Eliminar permiso
  async deletePermission(id) {
    const response = await api.delete(`/permissions/${id}/`);
    return response.data;
  },

  // Obtener permisos por rol
  async getPermissionsByRole(roleId) {
    const response = await api.get(`/permissions/?role=${roleId}`);
    return response.data;
  }
};
// src/services/modules.service.js
import api from './api.service';

export const modulesService = {
  // Obtener todos los módulos
  async getModules() {
    const response = await api.get('/modules/');
    return response.data;
  },

  // Obtener módulo por ID
  async getModuleById(id) {
    const response = await api.get(`/modules/${id}/`);
    return response.data;
  },

  // Crear módulo
  async createModule(moduleData) {
    const response = await api.post('/modules/', moduleData);
    return response.data;
  },

  // Actualizar módulo
  async updateModule(id, moduleData) {
    const response = await api.put(`/modules/${id}/`, moduleData);
    return response.data;
  },

  // Eliminar módulo
  async deleteModule(id) {
    const response = await api.delete(`/modules/${id}/`);
    return response.data;
  }
};
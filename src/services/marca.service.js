// src/services/marcas.service.js
import api from './api.service';

export const marcasService = {
  // Obtener todas las marcas
  async getMarcas() {
    const response = await api.get('/marca/');
    return response.data;
  },

  // Obtener marca por ID
  async getMarcaById(id) {
    const response = await api.get(`/marca/${id}/`);
    return response.data;
  },

  // Crear marca - NO se envía el ID
  async createMarca(marcaData) {
    const response = await api.post('/marca/', marcaData);
    return response.data;
  },

  // Actualizar marca
  async updateMarca(id, marcaData) {
    const response = await api.patch(`/marca/${id}/`, marcaData);
    return response.data;
  },

  // Eliminar marca
  async deleteMarca(id) {
    const response = await api.delete(`/marca/${id}/`);
    return response.data;
  }
};
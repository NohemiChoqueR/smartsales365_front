import api from './api.service';

/**
 * Servicio para gestionar los Descuentos.
 * Endpoints basados en el ViewSet: /api/descuentos/
 */
export const descuentoService = {
  
  /**
   * Obtener todos los descuentos.
   * GET /api/descuentos/
   */
  async getDescuentos() {
    const response = await api.get('/descuentos/');
    return response.data;
  },

  /**
   * Obtener un descuento por su ID.
   * GET /api/descuentos/{id}/
   */
  async getDescuentoById(id) {
    const response = await api.get(`/descuentos/${id}/`);
    return response.data;
  },

  /**
   * Crear un nuevo descuento.
   * POST /api/descuentos/
   */
  async createDescuento(descuentoData) {
    const response = await api.post('/descuentos/', descuentoData);
    return response.data;
  },

  /**
   * Actualizar un descuento existente.
   * PUT /api/descuentos/{id}/
   */
  async updateDescuento(id, descuentoData) {
    const response = await api.put(`/descuentos/${id}/`, descuentoData);
    return response.data;
  },

  /**
   * Actualizar parcialmente un descuento.
   * PATCH /api/descuentos/{id}/
   */
  async partialUpdateDescuento(id, descuentoData) {
    const response = await api.patch(`/descuentos/${id}/`, descuentoData);
    return response.data;
  },

  /**
   * Eliminar un descuento.
   * DELETE /api/descuentos/{id}/
   */
  async deleteDescuento(id) {
    const response = await api.delete(`/descuentos/${id}/`);
    return response.data; // O response.status
  }
};
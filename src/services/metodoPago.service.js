import api from './api.service';

/**
 * Servicio para gestionar los Métodos de Pago.
 * !! ADVERTENCIA: El endpoint '/metodos-pago/' es una suposición.
 * Verifica la URL correcta en tu 'urls.py' del backend.
 */
export const metodoPagoService = {
  
  /**
   * Obtener todos los métodos de pago.
   * GET /api/metodos-pago/
   */
  async getMetodosPago() {
    const response = await api.get('/metodos-pago/');
    return response.data;
  },

  /**
   * Obtener un método de pago por su ID.
   * GET /api/metodos-pago/{id}/
   */
  async getMetodoPagoById(id) {
    const response = await api.get(`/metodos-pago/${id}/`);
    return response.data;
  },

  /**
   * Crear un nuevo método de pago.
   * POST /api/metodos-pago/
   */
  async createMetodoPago(metodoPagoData) {
    const response = await api.post('/metodos-pago/', metodoPagoData);
    return response.data;
  },

  /**
   * Actualizar un método de pago.
   * PUT /api/metodos-pago/{id}/
   */
  async updateMetodoPago(id, metodoPagoData) {
    const response = await api.put(`/metodos-pago/${id}/`, metodoPagoData);
    return response.data;
  },

  /**
   * Eliminar un método de pago.
   * DELETE /api/metodos-pago/{id}/
   */
  async deleteMetodoPago(id) {
    const response = await api.delete(`/metodos-pago/${id}/`);
    return response.data; // O response.status
  }
};
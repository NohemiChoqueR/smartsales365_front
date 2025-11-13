import api from './api.service';

/**
 * Servicio para gestionar los Detalles de Venta.
 * Endpoints basados en el ViewSet: /api/detalles-venta/
 */
export const detalleVentaService = {
  
  /**
   * Obtener todos los detalles de venta.
   * GET /api/detalles-venta/
   * (Probablemente quieras filtrarlos por ID de venta, ej: /api/detalles-venta/?venta=1)
   */
  async getDetallesVenta() {
    const response = await api.get('/detalles-venta/');
    return response.data;
  },

  /**
   * Obtener un detalle de venta por su ID.
   * GET /api/detalles-venta/{id}/
   */
  async getDetalleVentaById(id) {
    const response = await api.get(`/detalles-venta/${id}/`);
    return response.data;
  },

  /**
   * Crear un nuevo detalle de venta.
   * POST /api/detalles-venta/
   */
  async createDetalleVenta(detalleData) {
    const response = await api.post('/detalles-venta/', detalleData);
    return response.data;
  },

  /**
   * Actualizar un detalle de venta.
   * PUT /api/detalles-venta/{id}/
   */
  async updateDetalleVenta(id, detalleData) {
    const response = await api.put(`/detalles-venta/${id}/`, detalleData);
    return response.data;
  },
  
  /**
   * Actualizar parcialmente un detalle de venta.
   * PATCH /api/detalles-venta/{id}/
   */
  async partialUpdateDetalleVenta(id, detalleData) {
    const response = await api.patch(`/detalles-venta/${id}/`, detalleData);
    return response.data;
  },

  /**
   * Eliminar un detalle de venta.
   * DELETE /api/detalles-venta/{id}/
   */
  async deleteDetalleVenta(id) {
    const response = await api.delete(`/detalles-venta/${id}/`);
    return response.data; // O response.status
  }
};
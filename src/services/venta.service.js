import api from './api.service';

/**
 * Servicio para gestionar las Ventas.
 * Endpoints basados en el ViewSet: /api/ventas/
 */
export const ventaService = {
  
  /**
   * Obtener todas las ventas.
   * GET /api/ventas/
   */
  async getVentas() {
    const response = await api.get('/ventas/');
    return response.data;
  },

  /**
   * Obtener una venta por su ID.
   * GET /api/ventas/{id}/
   */
  async getVentaById(id) {
    const response = await api.get(`/ventas/${id}/`);
    return response.data;
  },

  /**
   * Crear una nueva venta.
   * POST /api/ventas/
   */
  async createVenta(ventaData) {
    const response = await api.post('/ventas/', ventaData);
    return response.data;
  },

  /**
   * Actualizar una venta.
   * PUT /api/ventas/{id}/
   */
  async updateVenta(id, ventaData) {
    const response = await api.put(`/ventas/${id}/`, ventaData);
    return response.data;
  },
  
  /**
   * Actualizar parcialmente una venta.
   * PATCH /api/ventas/{id}/
   */
  async partialUpdateVenta(id, ventaData) {
    const response = await api.patch(`/ventas/${id}/`, ventaData);
    return response.data;
  },

  /**
   * Eliminar una venta.
   * DELETE /api/ventas/{id}/
   */
  async deleteVenta(id) {
    const response = await api.delete(`/ventas/${id}/`);
    return response.data; // O response.status
  }
};
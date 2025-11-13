import api from './api.service';

/**
 * Servicio para gestionar los Detalles de Producto.
 * Endpoints basados en el ViewSet: /api/detalle/
 * * Nota: El producto y su detalle a menudo se gestionan juntos 
 * (el detalle viene anidado en el producto).
 * Este servicio es para el caso en que necesites
 * crear/editar/eliminar un detalle por separado.
 */
export const detalleProductoService = {
  
  /**
   * Obtener todos los detalles.
   * GET /api/detalle/
   */
  async getDetalles() {
    const response = await api.get('/detalle/');
    return response.data;
  },

  /**
   * Obtener un detalle por su ID.
   * GET /api/detalle/{id}/
   */
  async getDetalleById(id) {
    const response = await api.get(`/detalle/${id}/`);
    return response.data;
  },

  /**
   * Crear un nuevo detalle de producto.
   * POST /api/detalle/
   */
  async createDetalle(detalleData) {
    // detalleData debe ser un objeto con:
    // { producto, potencia, velocidades, voltaje, etc... }
    const response = await api.post('/detalle/', detalleData);
    return response.data;
  },

  /**
   * Actualizar un detalle de producto.
   * PUT /api/detalle/{id}/
   */
  async updateDetalle(id, detalleData) {
    const response = await api.put(`/detalle/${id}/`, detalleData);
    return response.data;
  },

  /**
   * Actualizar parcialmente un detalle de producto.
   * PATCH /api/detalle/{id}/
   */
  async partialUpdateDetalle(id, detalleData) {
    const response = await api.patch(`/detalle/${id}/`, detalleData);
    return response.data;
  },

  /**
   * Eliminar un detalle de producto.
   * DELETE /api/detalle/{id}/
   */
  async deleteDetalle(id) {
    const response = await api.delete(`/detalle/${id}/`);
    return response.data; // O response.status
  }
};
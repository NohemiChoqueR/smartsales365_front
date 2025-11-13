import api from './api.service';

/**
 * Servicio para gestionar las Campañas.
 * Endpoints basados en el ViewSet: /api/campanias/
 */
export const campaniaService = {
  
  /**
   * Obtener todas las campañas.
   * GET /api/campanias/
   */
  async getCampanias() {
    const response = await api.get('/campanias/');
    return response.data;
  },

  /**
   * Obtener una campaña por su ID.
   * GET /api/campanias/{id}/
   */
  async getCampaniaById(id) {
    const response = await api.get(`/campanias/${id}/`);
    return response.data;
  },

  /**
   * Crear una nueva campaña.
   * POST /api/campanias/
   */
  async createCampania(campaniaData) {
    const response = await api.post('/campanias/', campaniaData);
    return response.data;
  },

  /**
   * Actualizar una campaña existente.
   * PUT /api/campanias/{id}/
   */
  async updateCampania(id, campaniaData) {
    const response = await api.put(`/campanias/${id}/`, campaniaData);
    return response.data;
  },

  /**
   * Actualizar parcialmente una campaña.
   * PATCH /api/campanias/{id}/
   */
  async partialUpdateCampania(id, campaniaData) {
    const response = await api.patch(`/campanias/${id}/`, campaniaData);
    return response.data;
  },

  /**
   * Eliminar una campaña.
   * DELETE /api/campanias/{id}/
   */
  async deleteCampania(id) {
    const response = await api.delete(`/campanias/${id}/`);
    return response.data; // O response.status
  }
};
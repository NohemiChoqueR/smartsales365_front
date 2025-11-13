// src/services/prediction.service.js
import api from './api.service'; // Usas el mismo 'api.service' que ya tienes

/**
 * Servicio para consumir los endpoints de predicción de la API.
 */
export const predictionService = {
  
  /**
   * Predice la demanda de un producto específico.
   * GET /api/predict/demand/{producto_id}/
   */
  async predictDemand(producto_id) {
    const response = await api.get(`/predict/demand/${producto_id}/`);
    return response.data;
  },

  /**
   * Recomienda productos basados en un producto_id.
   * GET /api/predict/recommend/{producto_id}/
   */
  async getRecommendations(producto_id) {
    const response = await api.get(`/predict/recommend/${producto_id}/`);
    return response.data;
  },

  /**
   * Predice las ventas para una subcategoría.
   * GET /api/predict/sales/category/{subcategoria_id}/
   */
  async predictSalesCategory(subcategoria_id) {
    const response = await api.get(`/predict/sales/category/${subcategoria_id}/`);
    return response.data;
  }
};
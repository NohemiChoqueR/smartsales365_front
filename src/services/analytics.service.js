// src/services/analytics.service.js
import api from './api.service';

export const analyticsService = {

  /** 📊 KPIs del dashboard
   * GET /api/prediccion/kpis/
   */
  async getKpis() {
    const response = await api.get('/prediccion/kpis/');
    return response.data;
  },

  /** 📈 Predicciones de ventas futuras
   * GET /api/prediccion/predicciones/?dias=30
   */
  async getPredicciones(dias = 30) {
    const response = await api.get('/prediccion/predicciones/', {
      params: { dias }
    });
    return response.data;
  },

  /** 📅 Ventas históricas (agrupadas)
   * GET /api/prediccion/historial/?fecha_inicio=YYYY-MM-DD&fecha_fin=YYYY-MM-DD
   */
  async getHistorial(params = {}) {
    const response = await api.get('/prediccion/historial/', {
      params
    });
    return response.data;
  },

  /** 🟥 Productos de baja rotación
   * GET /api/prediccion/baja-rotacion/?limite=10&periodo=90
   */
  async getBajaRotacion(params = {}) {
    const response = await api.get('/prediccion/baja-rotacion/', {
      params
    });
    return response.data;
  },

};

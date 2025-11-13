import api from './api.service';

/**
 * Servicio para gestionar los Pagos y el intent de Stripe.
 */
export const pagoService = {
  
  // --- Métodos del ViewSet (/api/pagos/) ---

  /**
   * Obtener todos los pagos.
   * GET /api/pagos/
   */
  async getPagos() {
    const response = await api.get('/pagos/');
    return response.data;
  },

  /**
   * Obtener un pago por su ID.
   * GET /api/pagos/{id}/
   */
  async getPagoById(id) {
    const response = await api.get(`/pagos/${id}/`);
    return response.data;
  },

  /**
   * Crear un nuevo pago.
   * POST /api/pagos/
   */
  async createPago(pagoData) {
    const response = await api.post('/pagos/', pagoData);
    return response.data;
  },

  /**
   * Actualizar un pago.
   * PUT /api/pagos/{id}/
   */
  async updatePago(id, pagoData) {
    const response = await api.put(`/pagos/${id}/`, pagoData);
    return response.data;
  },
  
  /**
   * Actualizar parcialmente un pago.
   * PATCH /api/pagos/{id}/
   */
  async partialUpdatePago(id, pagoData) {
    const response = await api.patch(`/pagos/${id}/`, pagoData);
    return response.data;
  },

  /**
   * Eliminar un pago.
   * DELETE /api/pagos/{id}/
   */
  async deletePago(id) {
    const response = await api.delete(`/pagos/${id}/`);
    return response.data; // O response.status
  },

  // --- Método de la Vista Personalizada (Stripe) ---

  /**
   * Crea un Payment Intent de Stripe para iniciar el proceso de pago.
   * POST /api/crear-payment-intent/
   * @param {object} paymentIntentData - Datos necesarios para crear el intent 
   * (ej: { items: [...], amount: 1000, currency: 'usd' } 
   * o lo que sea que espere tu backend)
   */
  async crearPaymentIntent(paymentIntentData) {
    // Nota: La URL no lleva /api/ al inicio si está al mismo nivel que el router
    // Asumiendo que el prefijo /api/ es global:
    const response = await api.post('/crear-payment-intent/', paymentIntentData);
    // Stripe devuelve un objeto con { clientSecret: '...' }
    return response.data; 
  }
};
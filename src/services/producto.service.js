// src/services/producto.service.js
import api from './api.service';

/**
 * Servicio para gestionar los Productos.
 * Endpoints basados en el ViewSet: /api/producto/
 */
export const productoService = {
  
  /**
   * Obtener todos los productos.
   * GET /api/producto/
   */
  async getProductos() {
    const response = await api.get('/producto/');
    return response.data;
  },

  /**
   * Obtener un producto por su ID.
   * GET /api/producto/{id}/
   */
  async getProductoById(id) {
    const response = await api.get(`/producto/${id}/`);
    return response.data;
  },

  /**
   * Crear un nuevo producto.
   * POST /api/producto/
   */
  async createProducto(productoData) {
    // productoData debe ser un objeto con:
    // { nombre, sku, precio_venta, descripcion, marca, subcategoria, esta_activo, empresa }
    const response = await api.post('/producto/', productoData);
    return response.data;
  },

  /**
   * Actualizar un producto existente.
   * PUT /api/producto/{id}/
   */
  async updateProducto(id, productoData) {
    const response = await api.put(`/producto/${id}/`, productoData);
    return response.data;
  },

  /**
   * Actualizar parcialmente un producto existente.
   * PATCH /api/producto/{id}/
   */
  async partialUpdateProducto(id, productoData) {
    const response = await api.patch(`/producto/${id}/`, productoData);
    return response.data;
  },

  /**
   * Eliminar un producto.
   * DELETE /api/producto/{id}/
   */
  async deleteProducto(id) {
    const response = await api.delete(`/producto/${id}/`);
    return response.data; // O response.status si no devuelve contenido
  }
};
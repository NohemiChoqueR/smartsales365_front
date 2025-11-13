import api from './api.service';

/**
 * Servicio para gestionar las Imágenes de Producto.
 * Endpoints basados en el ViewSet: /api/imagenes/
 */
export const imagenProductoService = {
  
  /**
   * Obtener todas las imágenes (generalmente filtradas por producto).
   * GET /api/imagenes/
   * * Probablemente quieras usuarlo con un filtro, ej:
   * api.get('/imagenes/?producto=1')
   * Podrías añadir un método:
   * async getImagenesPorProducto(productoId) {
   * const response = await api.get(`/imagenes/?producto=${productoId}`);
   * return response.data;
   * }
   */
  async getImagenes() {
    const response = await api.get('/imagenes/');
    return response.data;
  },

  /**
   * Obtener una imagen por su ID.
   * GET /api/imagenes/{id}/
   */
  async getImagenById(id) {
    const response = await api.get(`/imagenes/${id}/`);
    return response.data;
  },

  /**
   * Subir una nueva imagen de producto.
   * POST /api/imagenes/
   * * IMPORTANTE: Para subir archivos, es muy probable que necesites
   * usar 'Content-Type': 'multipart/form-data' y enviar un FormData
   * en lugar de JSON.
   */
  async createImagen(imagenData) {
    // Si envías JSON (ej. solo la URL):
    // const response = await api.post('/imagenes/', imagenData);
    
    // Si subes un archivo (lo más común):
    // imagenData debe ser un objeto FormData
    // const response = await api.post('/imagenes/', imagenData, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //   },
    // });
    
    // Asumiendo JSON por simplicidad del servicio:
    const response = await api.post('/imagenes/', imagenData);
    return response.data;
  },

  /**
   * Actualizar una imagen.
   * PUT /api/imagenes/{id}/
   */
  async updateImagen(id, imagenData) {
    // Aplica la misma lógica de FormData si es necesario
    const response = await api.put(`/imagenes/${id}/`, imagenData);
    return response.data;
  },

  /**
   * Eliminar una imagen.
   * DELETE /api/imagenes/{id}/
   */
  async deleteImagen(id) {
    const response = await api.delete(`/imagenes/${id}/`);
    return response.data; // O response.status
  }
};
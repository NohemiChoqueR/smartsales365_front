import api from './api.service';

/**
 * Servicio para gestionar los Departamentos.
 * Endpoints basados en el ViewSet: /api/departamentos/
 */
export const departamentoService = {
  async getDepartamentos() {
    const response = await api.get('/departamentos/');
    return response.data;
  },
  async getDepartamentoById(id) {
    const response = await api.get(`/departamentos/${id}/`);
    return response.data;
  },
  async createDepartamento(data) {
    const response = await api.post('/departamentos/', data);
    return response.data;
  },
  async updateDepartamento(id, data) {
    const response = await api.put(`/departamentos/${id}/`, data);
    return response.data;
  },
  async deleteDepartamento(id) {
    const response = await api.delete(`/departamentos/${id}/`);
    return response.data;
  }
};

/**
 * Servicio para gestionar las Direcciones.
 * Endpoints basados en el ViewSet: /api/direcciones/
 */
export const direccionService = {
  async getDirecciones() {
    const response = await api.get('/direcciones/');
    return response.data;
  },
  async getDireccionById(id) {
    const response = await api.get(`/direcciones/${id}/`);
    return response.data;
  },
  async createDireccion(data) {
    const response = await api.post('/direcciones/', data);
    return response.data;
  },
  async updateDireccion(id, data) {
    const response = await api.put(`/direcciones/${id}/`, data);
    return response.data;
  },
  async deleteDireccion(id) {
    const response = await api.delete(`/direcciones/${id}/`);
    return response.data;
  }
};

/**
 * Servicio para gestionar las Sucursales.
 * Endpoints basados en el ViewSet: /api/sucursales/
 */
export const sucursalService = {
  async getSucursales() {
    const response = await api.get('/sucursales/');
    return response.data;
  },
  async getSucursalById(id) {
    const response = await api.get(`/sucursales/${id}/`);
    return response.data;
  },
  async createSucursal(data) {
    const response = await api.post('/sucursales/', data);
    return response.data;
  },
  async updateSucursal(id, data) {
    const response = await api.put(`/sucursales/${id}/`, data);
    return response.data;
  },
  async deleteSucursal(id) {
    const response = await api.delete(`/sucursales/${id}/`);
    return response.data;
  }
};

/**
 * Servicio para gestionar el Stock por Sucursal.
 * Endpoints basados en el ViewSet: /api/stocksucursales/
 */
export const stockSucursalService = {
  async getStockSucursales() {
    const response = await api.get('/stocksucursales/');
    return response.data;
  },
  async getStockSucursalById(id) {
    const response = await api.get(`/stocksucursales/${id}/`);
    return response.data;
  },
  async createStockSucursal(data) {
    const response = await api.post('/stocksucursales/', data);
    return response.data;
  },
  async updateStockSucursal(id, data) {
    const response = await api.put(`/stocksucursales/${id}/`, data);
    return response.data;
  },
  async deleteStockSucursal(id) {
    const response = await api.delete(`/stocksucursales/${id}/`);
    return response.data;
  }
};
// src/services/categoria.service.js
import api from './api.service';

export const categoriaService = {
  // CATEGORÍAS
  async getAll() {
    const response = await api.get('/categoria/');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/categoria/${id}/`);
    return response.data;
  },

  async create(categoriaData) {
    const response = await api.post('/categoria/', categoriaData);
    return response.data;
  },

  async update(id, categoriaData) {
    const response = await api.put(`/categoria/${id}/`, categoriaData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/categoria/${id}/`);
    return response.data;
  },

  // SUBCATEGORÍAS
  async getAllSubcategorias() {
    const response = await api.get('/subcategoria/');
    return response.data;
  },

  async getSubcategoriaById(id) {
    const response = await api.get(`/subcategoria/${id}/`);
    return response.data;
  },

  async createSubcategoria(subcategoriaData) {
    const response = await api.post('/subcategoria/', subcategoriaData);
    return response.data;
  },

  async updateSubcategoria(id, subcategoriaData) {
    const response = await api.put(`/subcategoria/${id}/`, subcategoriaData);
    return response.data;
  },

  async deleteSubcategoria(id) {
    const response = await api.delete(`/subcategoria/${id}/`);
    return response.data;
  },

  // MÉTODOS ESPECIALES (útiles para tu UI)
  async getSubcategoriasByCategoria(categoriaId) {
    const response = await api.get(`/subcategoria/?categoria=${categoriaId}`);
    return response.data;
  }
};
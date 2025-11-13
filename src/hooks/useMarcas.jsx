// src/hooks/useMarcas.jsx
import { useState, useEffect } from 'react';
import { marcasService } from '../services/marca.service';

export const useMarcas = () => {
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [operationLoading, setOperationLoading] = useState(false);

  const fetchMarcas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await marcasService.getMarcas();
      setMarcas(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar marcas');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createMarca = async (marcaData) => {
    try {
      setOperationLoading(true);
      // 🔥 LIMPIAR datos antes de enviar - no enviar ID si existe
      const cleanData = { ...marcaData };
      if (cleanData.id) delete cleanData.id; // Asegurar que no se envíe ID
      
      console.log('📤 Creando marca con datos:', cleanData);
      const newMarca = await marcasService.createMarca(cleanData);
      
      // Actualizar lista localmente sin recargar todo
      setMarcas(prev => [...prev, newMarca]);
      return newMarca;
    } catch (err) {
      const errorMsg = err.response?.data || err;
      console.error('❌ Error creando marca:', errorMsg);
      throw errorMsg;
    } finally {
      setOperationLoading(false);
    }
  };

  const updateMarca = async (id, marcaData) => {
    try {
      setOperationLoading(true);
      // 🔥 LIMPIAR datos antes de enviar
      const cleanData = { ...marcaData };
      if (cleanData.id) delete cleanData.id; // No enviar ID en el body
      
      console.log('📤 Actualizando marca:', id, 'con datos:', cleanData);
      const updatedMarca = await marcasService.updateMarca(id, cleanData);
      
      // Actualizar lista localmente sin recargar todo
      setMarcas(prev => prev.map(marca => 
        marca.id === id ? updatedMarca : marca
      ));
      return updatedMarca;
    } catch (err) {
      const errorMsg = err.response?.data || err;
      console.error('❌ Error actualizando marca:', errorMsg);
      throw errorMsg;
    } finally {
      setOperationLoading(false);
    }
  };

  const deleteMarca = async (id) => {
    try {
      setOperationLoading(true);
      console.log('🗑️ Eliminando marca:', id);
      await marcasService.deleteMarca(id);
      
      // Actualizar lista localmente sin recargar todo
      setMarcas(prev => prev.filter(marca => marca.id !== id));
    } catch (err) {
      const errorMsg = err.response?.data || err;
      console.error('❌ Error eliminando marca:', errorMsg);
      throw errorMsg;
    } finally {
      setOperationLoading(false);
    }
  };

  useEffect(() => {
    fetchMarcas();
  }, []);

  return {
    marcas,
    loading,
    error,
    operationLoading, // 🔥 NUEVO: loading para operaciones específicas
    refetch: fetchMarcas,
    createMarca,
    updateMarca,
    deleteMarca
  };
};
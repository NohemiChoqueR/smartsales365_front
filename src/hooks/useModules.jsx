// src/hooks/useModules.js
import { useState, useEffect } from 'react';
import { modulesService } from '../services/modules.service';

export const useModules = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchModules = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await modulesService.getModules();
      setModules(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar módulos');
    } finally {
      setLoading(false);
    }
  };

  const createModule = async (moduleData) => {
    try {
      const newModule = await modulesService.createModule(moduleData);
      setModules(prev => [...prev, newModule]);
      return newModule;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  const updateModule = async (id, moduleData) => {
    try {
      const updatedModule = await modulesService.updateModule(id, moduleData);
      setModules(prev => prev.map(module => module.id === id ? updatedModule : module));
      return updatedModule;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  const deleteModule = async (id) => {
    try {
      await modulesService.deleteModule(id);
      setModules(prev => prev.filter(module => module.id !== id));
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  return {
    modules,
    loading,
    error,
    refetch: fetchModules,
    createModule,
    updateModule,
    deleteModule
  };
};
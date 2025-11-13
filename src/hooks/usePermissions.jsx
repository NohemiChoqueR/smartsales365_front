// src/hooks/usePermissions.js
import { useState, useEffect } from 'react';
import { permissionsService } from '../services/permissions.service';

export const usePermissions = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await permissionsService.getPermissions();
      setPermissions(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar permisos');
    } finally {
      setLoading(false);
    }
  };

  const createPermission = async (permissionData) => {
    try {
      const newPermission = await permissionsService.createPermission(permissionData);
      setPermissions(prev => [...prev, newPermission]);
      return newPermission;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  const updatePermission = async (id, permissionData) => {
    try {
      const updatedPermission = await permissionsService.updatePermission(id, permissionData);
      setPermissions(prev => prev.map(perm => perm.id === id ? updatedPermission : perm));
      return updatedPermission;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  const deletePermission = async (id) => {
    try {
      await permissionsService.deletePermission(id);
      setPermissions(prev => prev.filter(perm => perm.id !== id));
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  return {
    permissions,
    loading,
    error,
    refetch: fetchPermissions,
    createPermission,
    updatePermission,
    deletePermission
  };
};
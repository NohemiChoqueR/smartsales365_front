// src/hooks/useRoles.jsx
import { useState, useEffect } from 'react';
import { rolesService } from '../services/roles.service';

export const useRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await rolesService.getRoles();
      setRoles(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar roles');
    } finally {
      setLoading(false);
    }
  };

  const createRole = async (roleData) => {
    try {
      const newRole = await rolesService.createRole(roleData);
      await fetchRoles(); 
      return newRole;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  const updateRole = async (id, roleData) => {
    try {
      const updatedRole = await rolesService.updateRole(id, roleData);
      await fetchRoles(); // 
      return updatedRole;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  const deleteRole = async (id) => {
    try {
      await rolesService.deleteRole(id);
      await fetchRoles(); 
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return {
    roles,
    loading,
    error,
    refetch: fetchRoles,
    createRole,
    updateRole,
    deleteRole
  };
};
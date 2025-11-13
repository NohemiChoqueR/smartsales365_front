// src/hooks/useUsers.js
import { useState, useEffect } from 'react';
import { usersService } from '../services/users.service';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await usersService.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  // Cargar usuarios al montar el hook
  useEffect(() => {
    fetchUsers();
  }, []);

  // Función para crear
  const createUser = async (userData) => {
    try {
      // No necesitamos 'newUserv' aquí, solo refrescamos la lista
      await usersService.createUser(userData);
      await fetchUsers(); // Recargamos la lista de usuarios
    } catch (err) {
      // Lanzamos el error para que el formulario lo atrape
      throw err.response?.data || err;
    }
  };

  // Función para actualizar
  const updateUser = async (id, userData) => {
    try {
      await usersService.updateUser(id, userData);
      await fetchUsers(); // Recargamos la lista
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  // Función para eliminar
  const deleteUser = async (id) => {
    try {
      await usersService.deleteUser(id);
      // Actualizamos el estado localmente para una UI más rápida
      setUsers(prev => prev.filter(user => user.id !== id));
      // O puedes optar por refrescar todo:
      // await fetchUsers();
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    createUser,
    updateUser,
    deleteUser
  };
};
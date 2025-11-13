// src/components/forms/PermissionForm.jsx
import React, { useState, useEffect } from 'react';
import ModalForm from './ModalForm';
import FormField from './FormField';
import { usePermissions } from '../../hooks/usePermissions';
import { useRoles } from '../../hooks/useRoles';
import { useModules } from '../../hooks/useModules';

const PermissionForm = ({ isOpen, onClose, permission, onSuccess }) => {
  const { createPermission, updatePermission, loading } = usePermissions();
  const { roles } = useRoles();
  const { modules } = useModules();
  
  const [formData, setFormData] = useState({
    role: '',
    module: '',
    can_view: false,
    can_create: false,
    can_update: false,
    can_delete: false
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (permission) {
      setFormData({
        role: permission.role.id.toString(),
        module: permission.module.id.toString(),
        can_view: permission.can_view,
        can_create: permission.can_create,
        can_update: permission.can_update,
        can_delete: permission.can_delete
      });
    } else {
      setFormData({
        role: '',
        module: '',
        can_view: false,
        can_create: false,
        can_update: false,
        can_delete: false
      });
    }
    setErrors({});
    setSubmitError('');
  }, [permission, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (submitError) {
      setSubmitError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    // Validación
    const newErrors = {};
    if (!formData.role) {
      newErrors.role = 'El rol es requerido';
    }
    if (!formData.module) {
      newErrors.module = 'El módulo es requerido';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const permissionData = {
        role: parseInt(formData.role),
        module: parseInt(formData.module),
        can_view: formData.can_view,
        can_create: formData.can_create,
        can_update: formData.can_update,
        can_delete: formData.can_delete
      };

      if (permission) {
        await updatePermission(permission.id, permissionData);
      } else {
        await createPermission(permissionData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error al guardar permiso:', error);
      setSubmitError('Error al guardar el permiso. Por favor, intenta nuevamente.');
    }
  };

  return (
    <ModalForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={permission ? 'Editar Permiso' : 'Crear Nuevo Permiso'}
      submitText={permission ? 'Actualizar' : 'Crear'}
      loading={loading}
    >
      {submitError && (
        <div className="mb-4 p-3 rounded-lg text-sm" 
             style={{ 
               backgroundColor: 'var(--color-error)20', 
               color: 'var(--color-error)',
               border: '1px solid var(--color-error)30'
             }}>
          {submitError}
        </div>
      )}
      
      {/* Select para Rol */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
          Rol *
        </label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Seleccionar rol</option>
          {roles.map(role => (
            <option key={role.id} value={role.id}>
              {role.display_name}
            </option>
          ))}
        </select>
        {errors.role && (
          <p className="mt-1 text-sm text-red-600">{errors.role}</p>
        )}
      </div>

      {/* Select para Módulo */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
          Módulo *
        </label>
        <select
          name="module"
          value={formData.module}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Seleccionar módulo</option>
          {modules.filter(module => module.is_active).map(module => (
            <option key={module.id} value={module.id}>
              {module.name}
            </option>
          ))}
        </select>
        {errors.module && (
          <p className="mt-1 text-sm text-red-600">{errors.module}</p>
        )}
      </div>

      {/* Checkboxes para permisos */}
      <div className="space-y-3">
        <label className="block text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
          Permisos:
        </label>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="can_view"
            name="can_view"
            checked={formData.can_view}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="can_view" className="ml-2 block text-sm text-gray-900">
            Ver
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="can_create"
            name="can_create"
            checked={formData.can_create}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="can_create" className="ml-2 block text-sm text-gray-900">
            Crear
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="can_update"
            name="can_update"
            checked={formData.can_update}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="can_update" className="ml-2 block text-sm text-gray-900">
            Editar
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="can_delete"
            name="can_delete"
            checked={formData.can_delete}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="can_delete" className="ml-2 block text-sm text-gray-900">
            Eliminar
          </label>
        </div>
      </div>
    </ModalForm>
  );
};

export default PermissionForm;
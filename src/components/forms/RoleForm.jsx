// src/components/forms/RoleForm.jsx (CORREGIDO)
import React, { useState, useEffect } from 'react';
import ModalForm from './ModalForm';
import FormField from './FormField';
import { useRoles } from '../../hooks/useRoles';

const RoleForm = ({ isOpen, onClose, role, onSuccess }) => {
  const { createRole, updateRole, loading } = useRoles();
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(''); // 🔥 Nuevo estado para error general

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name || '',
        description: role.description || ''
      });
    } else {
      setFormData({
        name: '',
        description: ''
      });
    }
    setErrors({});
    setSubmitError(''); // 🔥 Limpiar error al abrir/cerrar
  }, [role, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (submitError) {
      setSubmitError(''); // 🔥 Limpiar error general al escribir
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(''); // 🔥 Limpiar error al enviar
    
    // Validación simple
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (role) {
        await updateRole(role.id, formData);
      } else {
        await createRole(formData);
      }
      onSuccess();
    } catch (error) {
      // 🔥 Manejar cualquier error del backend de forma genérica
      console.error('Error al guardar rol:', error);
      setSubmitError('Error al guardar el rol. Por favor, intenta nuevamente.');
    }
  };

  return (
    <ModalForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={role ? 'Editar Rol' : 'Crear Nuevo Rol'}
      submitText={role ? 'Actualizar' : 'Crear'}
      loading={loading}
    >
      {/* 🔥 Mostrar error general si existe */}
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
      
      <FormField
        label="Nombre del rol"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Ej: Administrador, Agente de Ventas"
        required
        error={errors.name}
      />
      
      <FormField
        label="Descripción"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Descripción del rol..."
        type="textarea"
        rows={3}
      />
    </ModalForm>
  );
};

export default RoleForm;
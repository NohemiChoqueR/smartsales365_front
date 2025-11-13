// src/components/forms/ModuleForm.jsx (ACTUALIZADA)
import React, { useState, useEffect } from 'react';
import ModalForm from './ModalForm';
import FormField from './FormField';
import { useModules } from '../../hooks/useModules';

const ModuleForm = ({ isOpen, onClose, module, onSuccess }) => {
  const { createModule, updateModule, loading } = useModules();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (module) {
      setFormData({
        name: module.name || '',
        description: module.description || '',
        is_active: module.is_active !== undefined ? module.is_active : true
      });
    } else {
      setFormData({
        name: '',
        description: '',
        is_active: true
      });
    }
    setErrors({});
    setSubmitError('');
  }, [module, isOpen]);

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
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (module) {
        await updateModule(module.id, formData);
      } else {
        await createModule(formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error al guardar módulo:', error);
      setSubmitError('Error al guardar el módulo. Por favor, intenta nuevamente.');
    }
  };

  return (
    <ModalForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={module ? 'Editar Módulo' : 'Crear Nuevo Módulo'}
      submitText={module ? 'Actualizar' : 'Crear'}
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
      
      <FormField
        label="Nombre del módulo"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Ej: Gestión de Usuarios"
        required
        error={errors.name}
      />
      
      <FormField
        label="Descripción"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Descripción del módulo..."
        type="textarea"
        rows={3}
      />

      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_active"
          name="is_active"
          checked={formData.is_active}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label 
          htmlFor="is_active" 
          className="ml-2 block text-sm text-gray-900"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Módulo activo
        </label>
      </div>
    </ModalForm>
  );
};

export default ModuleForm;
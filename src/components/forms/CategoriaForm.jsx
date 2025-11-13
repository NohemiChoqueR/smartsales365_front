// src/components/forms/CategoriaForm.jsx
import React, { useState, useEffect } from 'react';
import ModalForm from './ModalForm';
import FormField from './FormField';
import { useCategorias } from '../../hooks/useCategorias';

const CategoriaForm = ({ isOpen, onClose, categoria, onSuccess }) => {
  const { createCategoria, updateCategoria, loading } = useCategorias();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    esta_activo: true
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (categoria) {
      setFormData({
        nombre: categoria.nombre || '',
        descripcion: categoria.descripcion || '',
        esta_activo: categoria.esta_activo ?? true
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        esta_activo: true
      });
    }
    setErrors({});
    setSubmitError('');
  }, [categoria, isOpen]);

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
    
    const newErrors = {};
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (categoria) {
        await updateCategoria(categoria.id, formData);
      } else {
        await createCategoria(formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      setSubmitError('Error al guardar la categoría. Por favor, intenta nuevamente.');
    }
  };

  return (
    <ModalForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={categoria ? 'Editar Categoría' : 'Crear Nueva Categoría'}
      submitText={categoria ? 'Actualizar' : 'Crear'}
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
        label="Nombre de la categoría"
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        placeholder="Ej: Tecnología, Electrohogar"
        required
        error={errors.nombre}
      />
      
      <FormField
        label="Descripción"
        name="descripcion"
        value={formData.descripcion}
        onChange={handleChange}
        placeholder="Descripción de la categoría..."
        type="textarea"
        rows={3}
      />

      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          name="esta_activo"
          checked={formData.esta_activo}
          onChange={handleChange}
          className="mr-2 rounded"
          style={{
            backgroundColor: formData.esta_activo ? 'var(--color-primary)' : 'var(--color-background)',
            borderColor: 'var(--color-border)'
          }}
        />
        <label style={{ color: 'var(--color-text-primary)' }}>
          Categoría activa
        </label>
      </div>
    </ModalForm>
  );
};

export default CategoriaForm;
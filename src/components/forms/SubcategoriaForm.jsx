// src/components/forms/SubcategoriaForm.jsx
import React, { useState, useEffect } from 'react';
import ModalForm from './ModalForm';
import FormField from './FormField';
import { useCategorias } from '../../hooks/useCategorias';

const SubcategoriaForm = ({ 
  isOpen, 
  onClose, 
  subcategoria, 
  categoriaPadre, 
  categorias, 
  onSuccess 
}) => {
  const { createSubcategoria, updateSubcategoria, loading } = useCategorias();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    esta_activo: true
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (subcategoria) {
      setFormData({
        nombre: subcategoria.nombre || '',
        descripcion: subcategoria.descripcion || '',
        categoria: subcategoria.categoria || '',
        esta_activo: subcategoria.esta_activo ?? true
      });
    } else if (categoriaPadre) {
      setFormData({
        nombre: '',
        descripcion: '',
        categoria: categoriaPadre.id,
        esta_activo: true
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        categoria: '',
        esta_activo: true
      });
    }
    setErrors({});
    setSubmitError('');
  }, [subcategoria, categoriaPadre, isOpen]);

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
    if (!formData.categoria) {
      newErrors.categoria = 'La categoría es requerida';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (subcategoria) {
        await updateSubcategoria(subcategoria.id, formData);
      } else {
        await createSubcategoria(formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error al guardar subcategoría:', error);
      setSubmitError('Error al guardar la subcategoría. Por favor, intenta nuevamente.');
    }
  };

  // Filtrar solo categorías activas para el select
  const categoriasActivas = categorias?.filter(cat => cat.esta_activo) || [];

  return (
    <ModalForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={
        subcategoria 
          ? 'Editar Subcategoría' 
          : categoriaPadre 
            ? `Crear Subcategoría en ${categoriaPadre.nombre}`
            : 'Crear Nueva Subcategoría'
      }
      submitText={subcategoria ? 'Actualizar' : 'Crear'}
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
      
      {/* Select de categoría - deshabilitado si viene de categoriaPadre */}
      <FormField
        label="Categoría padre"
        name="categoria"
        value={formData.categoria}
        onChange={handleChange}
        type="select"
        required
        disabled={!!categoriaPadre} // Deshabilitar si ya viene de una categoría
        options={categoriasActivas.map(cat => ({
          value: cat.id,
          label: cat.nombre
        }))}
        error={errors.categoria}
      />
      
      <FormField
        label="Nombre de la subcategoría"
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        placeholder="Ej: Televisores, Celulares, Computadoras"
        required
        error={errors.nombre}
      />
      
      <FormField
        label="Descripción"
        name="descripcion"
        value={formData.descripcion}
        onChange={handleChange}
        placeholder="Descripción de la subcategoría..."
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
          Subcategoría activa
        </label>
      </div>
    </ModalForm>
  );
};

export default SubcategoriaForm;
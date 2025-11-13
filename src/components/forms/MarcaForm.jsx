// src/components/forms/MarcaForm.jsx
import React, { useState, useEffect } from 'react';
import ModalForm from './ModalForm';
import FormField from './FormField';
import { useMarcas } from '../../hooks/useMarcas';

const MarcaForm = ({ isOpen, onClose, marca, onSuccess }) => {
  const { createMarca, updateMarca, operationLoading } = useMarcas(); // 🔥 Cambiado a operationLoading
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    pais_origen: '',
    esta_activo: true
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (marca && isOpen) {
      console.log('🔍 Datos de marca para editar:', marca);
      setFormData({
        nombre: marca.nombre || '',
        descripcion: marca.descripcion || '',
        pais_origen: marca.pais_origen || '',
        esta_activo: marca.esta_activo !== undefined ? marca.esta_activo : true
      });
    } else if (isOpen) {
      setFormData({
        nombre: '',
        descripcion: '',
        pais_origen: '',
        esta_activo: true
      });
    }
    setErrors({});
    setSubmitError('');
  }, [marca, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (submitError) setSubmitError('');
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.length > 100) {
      newErrors.nombre = 'El nombre no puede tener más de 100 caracteres';
    }
    
    if (formData.descripcion && formData.descripcion.length > 255) {
      newErrors.descripcion = 'La descripción es demasiado larga';
    }
    
    if (formData.pais_origen && formData.pais_origen.length > 100) {
      newErrors.pais_origen = 'El país de origen no puede tener más de 100 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    if (!validateForm()) {
      return;
    }

    try {
      console.log('📤 Enviando datos del formulario:', formData);
      
      if (marca) {
        console.log('🔄 Actualizando marca existente ID:', marca.id);
        await updateMarca(marca.id, formData);
      } else {
        console.log('➕ Creando nueva marca');
        await createMarca(formData);
      }
      
      onSuccess();
    } catch (error) {
      console.error('❌ Error completo al guardar:', error);
      
      // 🔥 MEJOR MANEJO DE ERRORES
      let errorMessage = 'Error al guardar la marca';
      
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.nombre) {
        errorMessage = error.nombre[0];
      } else if (error.non_field_errors) {
        errorMessage = error.non_field_errors[0];
      } else if (typeof error === 'object') {
        // Intentar obtener el primer error del objeto
        const firstError = Object.values(error)[0];
        if (Array.isArray(firstError)) {
          errorMessage = firstError[0];
        } else if (typeof firstError === 'string') {
          errorMessage = firstError;
        }
      }
      
      setSubmitError(errorMessage);
    }
  };

  return (
    <ModalForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={marca ? 'Editar Marca' : 'Crear Nueva Marca'}
      submitText={marca ? 'Actualizar' : 'Crear'}
      loading={operationLoading} // 🔥 Usar operationLoading aquí
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
        label="Nombre de la marca *"
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        placeholder="Ej: Samsung, Sony, LG"
        required
        error={errors.nombre}
        maxLength={100}
      />
      
      <FormField
        label="Descripción"
        name="descripcion"
        value={formData.descripcion}
        onChange={handleChange}
        placeholder="Descripción de la marca..."
        type="textarea"
        rows={3}
        error={errors.descripcion}
      />
      
      <FormField
        label="País de origen"
        name="pais_origen"
        value={formData.pais_origen}
        onChange={handleChange}
        placeholder="Ej: Corea del Sur, Japón, Alemania"
        error={errors.pais_origen}
        maxLength={100}
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
          Marca activa
        </label>
      </div>
    </ModalForm>
  );
};

export default MarcaForm;
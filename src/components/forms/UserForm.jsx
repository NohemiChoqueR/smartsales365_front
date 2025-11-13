// src/components/forms/UserForm.jsx
import React, { useState, useEffect } from 'react';
import ModalForm from './ModalForm';
import FormField from './FormField';
import { useUsers } from '../../hooks/useUsers';
import { useRoles } from '../../hooks/useRoles';

const UserForm = ({ isOpen, onClose, user, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    nombre: '',
    apellido: '',
    telefono: '',
    role: '', // Almacenará el ID del rol (ej: "1", "2")
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createUser, updateUser } = useUsers();
  const { roles, loading: rolesLoading } = useRoles();

  const isEditing = !!user;

  // Efecto: Volvemos a usar el ID del rol
  useEffect(() => {
    if (isOpen) {
      if (user) {
        // Modo Edición: Pre-selecciona el 'id' del rol
        setFormData({
          email: user.email || '',
          nombre: user.nombre || '',
          apellido: user.apellido || '',
          telefono: user.telefono || '',
          role: user.role ? user.role.id : '', // <-- CAMBIO 1: Volvemos al ID
          password: '',
        });
      } else {
        // Modo Creación: Resetea a string vacío
        setFormData({
          email: '', nombre: '', apellido: '',
          telefono: '', role: '', password: '',
        });
      }
      setErrors({});
      setSubmitError('');
      setIsSubmitting(false);
    }
  }, [user, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    setSubmitError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setErrors({});
    
    // --- Validación (sigue igual, revisa string vacío) ---
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'El email es requerido';
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (formData.role === '') newErrors.role = 'El rol es requerido';
    if (!isEditing && !formData.password.trim()) newErrors.password = 'La contraseña es requerida';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true); 

    // ⬇️ ESTE ES EL CAMBIO CLAVE ⬇️
    // --- Preparación de datos ---
    const userData = {
      email: formData.email,
      nombre: formData.nombre,
      apellido: formData.apellido,
      telefono: formData.telefono,
      role_id: parseInt(formData.role), // <-- CAMBIO 3: Enviamos 'role_id'
    };
    // Ya no enviamos la clave 'role'

    if (formData.password) {
      userData.password = formData.password;
    }

    try {
      if (isEditing) {
        await updateUser(user.id, userData);
      } else {
        await createUser(userData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      const apiError = error.detail || error.email?.[0] || 'Error al guardar el usuario. Intenta nuevamente.';
      setSubmitError(apiError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={isEditing ? 'Editar Usuario' : 'Crear Usuario'}
      submitText={isEditing ? 'Guardar Cambios' : 'Crear Usuario'}
      loading={isSubmitting}
    >
      {/* --- Error Global --- */}
      {submitError && (
        <div className="mb-4 p-3 rounded-lg text-sm" 
             style={{ 
               backgroundColor: 'var(--color-error, #fef2f2)20', 
               color: 'var(--color-error, #991b1b)',
               border: '1px solid var(--color-error, #fecaca)30'
             }}>
          {submitError}
        </div>
      )}
      
      {/* --- Campos del Formulario --- */}
      <FormField
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="ejemplo@correo.com"
        required
        error={errors.email}
      />
      
      <FormField
        label="Nombre"
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        placeholder="Juan"
        required
        error={errors.nombre}
      />
      
      <FormField
        label="Apellido"
        name="apellido"
        value={formData.apellido}
        onChange={handleChange}
        placeholder="Pérez"
      />
      
      <FormField
        label="Teléfono"
        name="telefono"
        value={formData.telefono}
        onChange={handleChange}
        placeholder="70012345"
      />

      {/* --- Campo Select para Rol --- */}
      <div className="mb-4">
        <label 
          htmlFor="role" 
          className="block text-sm font-medium mb-1"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Rol <span className="text-red-500">*</span>
        </label>
        <select
          id="role"
          name="role"
          value={formData.role} // <-- Guardará el ID (como string)
          onChange={handleChange}
          disabled={rolesLoading}
          className={`
            block w-full rounded-md border-0 py-2 pl-3 pr-10 
            text-base sm:text-sm
            focus:ring-2 focus:ring-inset focus:ring-blue-500
            ${errors.role ? 'border-red-500' : 'border-gray-300'}
          `}
          style={{
            color: 'var(--color-text-primary)',
            backgroundColor: 'var(--color-bg-base)',
            border: `1px solid ${errors.role ? 'var(--color-error, #ef4444)' : 'var(--color-border, #d1d5db)'}`,
            '--tw-ring-color': 'var(--color-primary, #3b82f6)'
          }}
        >
          <option value="">{rolesLoading ? 'Cargando roles...' : 'Selecciona un rol'}</option>
          {roles.map(role => (
            // <-- CAMBIO 2: El 'value' es 'role.id'
            <option key={role.id} value={role.id}> 
              {role.display_name}
            </option>
          ))}
        </select>
        {errors.role && (
          <p 
            className="mt-1 text-xs text-red-600" 
            style={{ color: 'var(--color-error, #dc2626)' }}
          >
            {errors.role}
          </p>
        )}
      </div>
      
      <FormField
        label={isEditing ? 'Nueva Contraseña' : 'Contraseña'}
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder={isEditing ? '(Dejar en blanco para no cambiar)' : '••••••••'}
        required={!isEditing}
        error={errors.password}
      />

    </ModalForm>
  );
};

export default UserForm;
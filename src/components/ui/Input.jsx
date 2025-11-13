// src/components/ui/Input.js
import React from 'react';

const Input = ({ label, name, type = 'text', value, onChange, placeholder, required, disabled, icon, ...props }) => {
  const hasIcon = !!icon;

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={name} 
          className="block text-sm font-medium mb-1"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {label}
        </label>
      )}
      <div className="relative rounded-md shadow-sm">
        {hasIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {/* Clona el icono para añadirle clases de color */}
            {React.cloneElement(icon, {
              className: `${icon.props.className || ''} h-5 w-5`,
              style: { color: 'var(--color-text-placeholder, #9ca3af)' } // Color gris para el icono
            })}
          </div>
        )}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          {...props}
          className={`
            block w-full rounded-md border-0 py-2 
            ${hasIcon ? 'pl-10' : 'px-3'}
            text-base sm:text-sm
            focus:ring-2 focus:ring-inset focus:ring-blue-500
            disabled:cursor-not-allowed disabled:opacity-50
          `}
          style={{
            color: 'var(--color-text-primary)',
            backgroundColor: 'var(--color-bg-base)', // Asumiendo un fondo base
            border: '1px solid var(--color-border, #d1d5db)', // Un borde por defecto
            '--tw-ring-color': 'var(--color-primary, #3b82f6)' // Color de foco
          }}
        />
      </div>
    </div>
  );
};

export default Input;
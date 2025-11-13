// src/components/forms/FormField.jsx
import React from 'react';

const FormField = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  options = [], // para select
  rows = 3, // para textarea
  error
}) => {
  const inputBaseClasses = "w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 transition-colors";
  const inputStyles = {
    backgroundColor: 'var(--color-background)',
    borderColor: error ? 'var(--color-error)' : 'var(--color-border)',
    color: 'var(--color-text-primary)'
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
        {label} {required && <span style={{ color: 'var(--color-error)' }}>*</span>}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={inputBaseClasses}
          style={inputStyles}
        />
      ) : type === 'select' ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={inputBaseClasses}
          style={inputStyles}
        >
          <option value="">Seleccionar...</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={inputBaseClasses}
          style={inputStyles}
        />
      )}
      
      {error && (
        <p className="mt-1 text-sm" style={{ color: 'var(--color-error)' }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
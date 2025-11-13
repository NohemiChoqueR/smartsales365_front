// src/components/ui/Select.js
import React from 'react';

const Select = ({ label, name, value, onChange, required, disabled, children, ...props }) => {
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
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        {...props}
        className={`
          block w-full rounded-md border-0 py-2 pl-3 pr-10 
          text-base sm:text-sm
          focus:ring-2 focus:ring-inset focus:ring-blue-500
          disabled:cursor-not-allowed disabled:opacity-50
        `}
        style={{
          color: 'var(--color-text-primary)',
          backgroundColor: 'var(--color-bg-base)',
          border: '1px solid var(--color-border, #d1d5db)',
          '--tw-ring-color': 'var(--color-primary, #3b82f6)'
        }}
      >
        {children}
      </select>
    </div>
  );
};

export default Select;
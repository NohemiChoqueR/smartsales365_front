// src/components/ui/Button.jsx
// src/components/ui/Button.jsx (actualizado)
import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  loading, // 🔥 Cambiar esto
  disabled,
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center space-x-2 py-2 px-4 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2";
  
  const variants = {
    primary: 'bg-black text-white hover:bg-gray-800 focus:ring-gray-500',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500',
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
  };

  // 🔥 Convertir loading a string o undefined
  const loadingAttr = loading ? "true" : undefined;

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className} ${
        (loading || disabled) ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      disabled={loading || disabled}
      {...props}
      loading={loadingAttr} // 🔥 Usar el atributo convertido
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <span>Procesando...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
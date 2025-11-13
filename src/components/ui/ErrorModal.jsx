// src/components/ui/ErrorModal.jsx
import React from 'react';
import { AlertCircle } from 'lucide-react';
import Button from './Button';

const ErrorModal = ({ isOpen, onClose, title = "Error", message }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="rounded-lg max-w-md w-full p-6"
        style={{
          backgroundColor: 'var(--color-card)',
          border: '1px solid var(--color-border)'
        }}
      >
        {/* Icono */}
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-opacity-20"
             style={{ backgroundColor: 'var(--color-error)20' }}>
          <AlertCircle size={24} style={{ color: 'var(--color-error)' }} />
        </div>
        
        {/* Contenido */}
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            {title}
          </h3>
          <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            {message}
          </p>
        </div>
        
        {/* Botón */}
        <div className="flex justify-center">
          <Button 
            variant="primary" 
            onClick={onClose}
            className="px-6"
          >
            Entendido
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
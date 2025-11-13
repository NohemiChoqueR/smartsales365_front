// src/components/ui/ConfirmationModal.jsx
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from './Button';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "¿Estás seguro?",
  message = "Esta acción no se puede deshacer.",
  confirmText = "Eliminar",
  cancelText = "Cancelar",
  type = "danger"
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'danger': return 'var(--color-error)';
      case 'warning': return 'var(--color-warning)';
      default: return 'var(--color-error)';
    }
  };

  const getConfirmButtonVariant = () => {
    switch (type) {
      case 'danger': return 'danger';
      case 'warning': return 'primary';
      default: return 'danger';
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
        {/* Icono y título */}
        <div className="flex items-center space-x-3 mb-4">
          <div 
            className="flex items-center justify-center w-10 h-10 rounded-full bg-opacity-20"
            style={{ backgroundColor: getIconColor() + '20' }}
          >
            <AlertTriangle size={20} style={{ color: getIconColor() }} />
          </div>
          <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            {title}
          </h3>
        </div>
        
        {/* Mensaje */}
        <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          {message}
        </p>
        
        {/* Botones */}
        <div className="flex justify-end space-x-3">
          <Button 
            variant="secondary" 
            onClick={onClose}
            className="px-4"
          >
            {cancelText}
          </Button>
          <Button 
            variant={getConfirmButtonVariant()}
            onClick={onConfirm}
            className="px-4"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
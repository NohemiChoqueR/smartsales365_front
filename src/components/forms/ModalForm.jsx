// src/components/forms/ModalForm.jsx
import React from 'react';
import { X } from 'lucide-react';
import Button from '../ui/Button';

const ModalForm = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  submitText = "Guardar",
  cancelText = "Cancelar",
  children,
  loading = false
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: 'var(--color-card)',
          border: '1px solid var(--color-border)'
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b" 
             style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            {title}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg transition-colors hover:bg-opacity-10"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {children}
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t"
               style={{ borderColor: 'var(--color-border)' }}>
            <Button 
              type="button"
              variant="secondary" 
              onClick={onClose}
              disabled={loading}
            >
              {cancelText}
            </Button>
            <Button 
              type="submit"
              variant="primary"
              loading={loading}
            >
              {submitText}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalForm;
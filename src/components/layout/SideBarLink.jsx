import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarLink = ({ icon: Icon, text, to, collapsed = false, onClick, compact = false, isParentActive = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Detectar si esta ruta está activa o si es padre de una ruta activa
  const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
  const showAsActive = isActive || isParentActive;

  const handleClick = () => {
    if (to) {
      navigate(to);
    }
  };

  const baseStyles = {
    backgroundColor: showAsActive ? 'var(--color-surface)' : 'transparent',
    color: showAsActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
  };

  const hoverStyles = {
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-text-primary)',
  };

  return (
    <button
      onClick={(e) => {
        if (onClick) onClick(e);
        handleClick();
      }}
      className={`
        w-full flex items-center rounded-lg transition-colors
        ${collapsed ? 'justify-center p-2' : 'text-left space-x-3 px-3 py-2.5'}
        ${compact ? 'px-3 py-2' : ''}
        ${showAsActive ? 'font-semibold' : 'font-medium'}
      `}
      style={baseStyles}
      onMouseEnter={(e) => {
        if (!showAsActive) {
          Object.assign(e.target.style, hoverStyles);
        }
      }}
      onMouseLeave={(e) => {
        if (!showAsActive) {
          Object.assign(e.target.style, baseStyles);
        }
      }}
      title={collapsed ? text : ''}
    >
      <Icon 
        size={20} 
        style={{ 
          color: showAsActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' 
        }} 
      />
      {!collapsed && (
        <span className="text-sm tracking-tight">{text}</span>
      )}
    </button>
  );
};

export default SidebarLink;
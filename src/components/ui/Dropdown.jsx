// src/components/ui/Dropdown.jsx
import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({ children, trigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownDirection, setDropdownDirection] = useState('bottom');
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    if (!isOpen && triggerRef.current) {
      // Calcular si hay espacio suficiente abajo
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - triggerRect.bottom;
      const dropdownHeight = 112; // Altura aproximada del dropdown (2 items)
      
      setDropdownDirection(spaceBelow < dropdownHeight ? 'top' : 'bottom');
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div ref={triggerRef} onClick={handleToggle} className="cursor-pointer">
        {trigger}
      </div>
      
      {isOpen && (
        <div 
          className={`fixed w-48 rounded-lg shadow-xl z-[100] overflow-hidden ${
            dropdownDirection === 'top' ? 'bottom-auto' : 'top-auto'
          }`}
          style={{
            backgroundColor: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            // Posicionamiento absoluto respecto al viewport
            left: triggerRef.current ? 
              `${triggerRef.current.getBoundingClientRect().right - 192}px` : 'auto',
            [dropdownDirection === 'top' ? 'bottom' : 'top']: 
              triggerRef.current ? 
                `${dropdownDirection === 'top' 
                  ? window.innerHeight - triggerRef.current.getBoundingClientRect().top + 8
                  : triggerRef.current.getBoundingClientRect().bottom + 8
                }px` : 'auto'
          }}
        >
          <div className="py-1">
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child, {
                  onClick: () => {
                    child.props.onClick?.();
                    setIsOpen(false);
                  }
                });
              }
              return child;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
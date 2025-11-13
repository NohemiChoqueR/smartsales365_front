// src/components/ui/DataTable.jsx
import React, { useState, useMemo } from 'react';
import { MoreHorizontal, Edit, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Dropdown from './Dropdown';
import Button from './Button';

const DataTable = ({ 
  title,
  headers, 
  data, 
  actions = true,
  onEdit,
  onDelete,
  searchable = true,
  pagination = true,
  emptyMessage = "No hay datos disponibles",
  pageSize = 10 // 🔥 NUEVO: Tamaño de página configurable
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage] = useState(pageSize);

  // 🔥 FUNCIÓN DE BÚSQUEDA REAL
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter(row => 
      Object.values(row).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  // 🔥 PAGINACIÓN REAL
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Resetear a primera página al buscar
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredData.length);

  return (
    <div className="mx-6 my-4" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header de la tabla con búsqueda */}
      {title && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
            {title}
          </h3>
          {searchable && (
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: 'var(--color-text-secondary)' }} />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 text-sm rounded-lg border focus:outline-none focus:ring-1 transition-colors"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-primary)'
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-hidden" style={{ 
        backgroundColor: 'var(--color-card)',
      }}>
        {/* Encabezados */}
        <div className="grid px-6 py-3" style={{ 
          gridTemplateColumns: `repeat(${headers.length}, 1fr) ${actions ? '80px' : ''}`,
          borderBottom: `1px solid var(--color-border-light)`
        }}>
          {headers.map((header, index) => (
            <div 
              key={index}
              className="text-sm tracking-tight py-2"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {header}
            </div>
          ))}
          {actions && (
            <div className="text-sm tracking-tight text-right py-2" style={{ color: 'var(--color-text-secondary)' }}>
              Acciones
            </div>
          )}
        </div>
        
        {/* Filas */}
        <div>
          {paginatedData.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {searchTerm ? 'No se encontraron resultados' : emptyMessage}
              </p>
            </div>
          ) : (
            paginatedData.map((row, rowIndex) => (
              <div 
                key={rowIndex}
                className="grid px-6 py-3 transition-colors hover:bg-opacity-50"
                style={{ 
                  gridTemplateColumns: `repeat(${headers.length}, 1fr) ${actions ? '80px' : ''}`,
                  borderBottom: rowIndex < paginatedData.length - 1 ? `1px solid var(--color-border-light)` : 'none',
                  backgroundColor: 'var(--color-card)'
                }}
              >
                {Object.values(row).slice(0, headers.length).map((value, cellIndex) => (
                  <div 
                    key={cellIndex}
                    className="text-sm py-2 tracking-tight"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {value}
                  </div>
                ))}
                
                {actions && (
                  <div className="flex justify-end py-2">
                    <Dropdown
                      trigger={
                        <button 
                          className="p-2 rounded-lg transition-colors hover:bg-opacity-20 flex items-center justify-center"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          <MoreHorizontal size={18} />
                        </button>
                      }
                    >
                      <button 
                        onClick={() => onEdit && onEdit(row)}
                        className="flex items-center space-x-3 px-4 py-2 text-sm w-full text-left transition-colors hover:bg-opacity-10"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        <Edit size={16} />
                        <span>Editar</span>
                      </button>
                      <button 
                        onClick={() => onDelete && onDelete(row)}
                        className="flex items-center space-x-3 px-4 py-2 text-sm w-full text-left transition-colors hover:bg-opacity-10"
                        style={{ color: 'var(--color-error)' }}
                      >
                        <Trash2 size={16} />
                        <span>Eliminar</span>
                      </button>
                    </Dropdown>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 🔥 PAGINACIÓN REAL */}
      {pagination && filteredData.length > 0 && (
        <div className="flex justify-between items-center mt-4 px-2">
          <p className="text-sm tracking-tight" style={{ color: 'var(--color-text-secondary)' }}>
            Mostrando {startItem}-{endItem} de {filteredData.length}
          </p>
          <div className="flex space-x-2">
            <Button 
              variant="secondary" 
              className="px-3"
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
              <span>Anterior</span>
            </Button>
            <Button 
              variant="secondary" 
              className="px-3"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              <span>Siguiente</span>
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
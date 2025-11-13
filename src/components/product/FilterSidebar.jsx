import React from 'react';
import { ChevronDown, X } from 'lucide-react';

// Skeleton Loader component for when categories are loading
const SidebarSkeleton = () => (
  <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      <div className="h-5 bg-gray-200 rounded w-1/4"></div>
    </div>
    <div className="space-y-3 mb-6">
      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 ml-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 ml-4"></div>
    </div>
    <div className="space-y-3">
      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 ml-4"></div>
    </div>
  </div>
);

// Componente individual para cada categoría colapsable
const CategoryFilterGroup = ({ categoria, currentFilters, onFilterChange }) => {
  // Verificamos si alguna subcategoría de esta categoría está activa
  const isCategoryActive = categoria.subcategorias.some(
    sub => sub.id.toString() === currentFilters.subcategoria
  );

  // Por defecto, abrimos el acordeón si una subcategoría está activa
  const [isOpen, setIsOpen] = React.useState(isCategoryActive);
  
  // Si los filtros cambian, forzamos la reapertura si es necesario
  React.useEffect(() => {
    if (isCategoryActive) {
      setIsOpen(true);
    }
  }, [currentFilters.subcategoria, isCategoryActive]);


  // Si no hay subcategorías, no mostramos nada
  if (!categoria.subcategorias || categoria.subcategorias.length === 0) {
    return null;
  }

  return (
    <div className="py-2 border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
      >
        <span>{categoria.nombre}</span>
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      {isOpen && (
        <ul className="pl-4 pt-2 space-y-2">
          {categoria.subcategorias.map(subcat => {
            const isActive = currentFilters.subcategoria === subcat.id.toString();
            return (
              <li key={subcat.id}>
                <button
                  onClick={() => onFilterChange('subcategoria', subcat.id)}
                  className={`w-full text-left text-sm ${
                    isActive 
                      ? 'font-bold text-blue-600' 
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {subcat.nombre}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};


export const FilterSidebar = ({ 
  categorias = [], // Valor por defecto para evitar errores
  marcas = [],     // Placeholder para cuando tengamos el hook de marcas
  loading, 
  currentFilters, 
  onFilterChange 
}) => {

  if (loading) {
    return <SidebarSkeleton />;
  }

  const clearFilters = () => {
    // Llama a onFilterChange con null para cada filtro activo
    onFilterChange('subcategoria', null);
    onFilterChange('marca', null);
    onFilterChange('nombre', null);
    // ... etc. para cualquier otro filtro
  };
  
  // Comprobamos si hay algún filtro activo
  const hasActiveFilters = currentFilters.subcategoria || currentFilters.marca || currentFilters.nombre;

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Filtros</h3>
        {hasActiveFilters && (
          <button 
            onClick={clearFilters}
            className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center"
          >
            <X size={12} className="mr-1" />
            Limpiar
          </button>
        )}
      </div>

      {/* --- Sección de Categorías --- */}
      <div className="mb-6">
        <h4 className="text-base font-semibold text-gray-700 mb-2">Categorías</h4>
        {categorias.length > 0 ? (
          categorias.map(cat => (
            <CategoryFilterGroup 
              key={cat.id}
              categoria={cat}
              currentFilters={currentFilters}
              onFilterChange={onFilterChange}
            />
          ))
        ) : (
          <p className="text-sm text-gray-500">No hay categorías disponibles.</p>
        )}
      </div>

      {/* --- Sección de Marcas (Placeholder) --- */}
      <div className="mb-6">
        <h4 className="text-base font-semibold text-gray-700 mb-2">Marcas</h4>
        {/* Lógica para cuando tengamos el hook de marcas */}
        {marcas.length > 0 ? (
          <ul className="space-y-2">
            {marcas.map(marca => {
              const isActive = currentFilters.marca === marca.id.toString();
              return (
                <li key={marca.id}>
                  <button
                    onClick={() => onFilterChange('marca', marca.id)}
                    className={`w-full text-left text-sm ${
                      isActive 
                        ? 'font-bold text-blue-600' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    {marca.nombre}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">Próximamente...</p>
        )}
      </div>
      

    </div>
  );
};
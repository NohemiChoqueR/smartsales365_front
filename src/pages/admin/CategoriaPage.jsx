// src/pages/CategoriaPage.js
import React, { useState, useEffect } from 'react';
import { Filter, Plus, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import Header from '../../components/layout/Header';
import Button from '../../components/ui/Button';
import { useCategorias } from '../../hooks/useCategorias';
import CategoriaForm from '../../components/forms/CategoriaForm';
import SubcategoriaForm from '../../components/forms/SubcategoriaForm';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import ErrorModal from '../../components/ui/ErrorModal';
import Dropdown from '../../components/ui/Dropdown';

const CategoriaPage = () => {
  const { 
    categorias, 
    loading, 
    error, 
    deleteCategoria, 
    deleteSubcategoria,
    refetchCategorias 
  } = useCategorias();
  
  const [showCategoriaForm, setShowCategoriaForm] = useState(false);
  const [showSubcategoriaForm, setShowSubcategoriaForm] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState(null);
  const [editingSubcategoria, setEditingSubcategoria] = useState(null);
  const [categoriaPadre, setCategoriaPadre] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemType, setItemType] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState(null);

  const handleEditCategoria = (categoria) => {
    setEditingCategoria(categoria);
    setShowCategoriaForm(true);
  };

  const handleEditSubcategoria = (subcategoria) => {
    setEditingSubcategoria(subcategoria);
    setShowSubcategoriaForm(true);
  };

  const handleDeleteClick = (item, type) => {
    setItemToDelete(item);
    setItemType(type);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (itemType === 'categoria') {
        await deleteCategoria(itemToDelete.id);
        if (itemToDelete.id === selectedCategoria?.id) {
          setSelectedCategoria(null);
        }
      } else {
        await deleteSubcategoria(itemToDelete.id);
      }
      await refetchCategorias();
      setShowDeleteModal(false);
      setItemToDelete(null);
      setItemType(null);
    } catch (error) {
      setErrorMessage(`Error al eliminar ${itemType === 'categoria' ? 'la categoría' : 'la subcategoría'}`);
      setShowErrorModal(true);
    }
  };

  const handleAddSubcategoria = () => {
    if (!selectedCategoria) return; 
    setCategoriaPadre(selectedCategoria);
    setShowSubcategoriaForm(true);
  };

  const handleAddCategoria = () => {
    setEditingCategoria(null);
    setShowCategoriaForm(true);
  };

  const handleFormClose = () => {
    setShowCategoriaForm(false);
    setShowSubcategoriaForm(false);
    setEditingCategoria(null);
    setEditingSubcategoria(null);
    setCategoriaPadre(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    refetchCategorias();
  };

  useEffect(() => {
    if (selectedCategoria) {
      const updatedCategoria = categorias.find(c => c.id === selectedCategoria.id);
      setSelectedCategoria(updatedCategoria || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorias]); 


  if (loading && categorias.length === 0) return (
    <div className="min-h-full flex items-center justify-center">
      <div style={{ color: 'var(--color-text-secondary)' }}>Cargando categorías...</div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-full flex items-center justify-center">
      <div style={{ color: 'var(--color-error)' }}>Error: {error}</div>
    </div>
  );

  return (
    <div className="min-h-full flex flex-col">
      <Header breadcrumb={['Dashboard', 'Categorías']} />
  
      {/* Encabezado principal de la página */}
      <div className="px-6 pt-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 style={{ color: 'var(--color-text-primary)' }} className="text-2xl font-bold tracking-tight">
              Categorías y Subcategorías
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }} className="mt-1 text-sm tracking-tight">
              Gestión de categorías y sus subcategorías
            </p>
          </div>
          
          <Button variant="secondary" className="px-3">
            <Filter size={16} />
            <span>Filtrar</span>
          </Button>
        </div>
      </div>
  
      {/* Contenedor principal de 2 columnas 
        FIX: Se apila en móvil (flex-col) y se divide en desktop (lg:flex-row) 
      */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 px-6 pb-6">
  
        {/* === COLUMNA MAESTRA (IZQUIERDA) - CATEGORÍAS ===
          FIX: Ocupa todo el ancho en móvil (w-full) y 1/3 en desktop (lg:w-1/3)
        */}
        <div className="w-full lg:w-1/3 flex flex-col">
          {/* Encabezado de la columna */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium" style={{ color: 'var(--color-text-primary)' }}>
              Categorías
            </h2>
            <Button 
              variant="primary" 
              className="px-3"
              onClick={handleAddCategoria}
            >
              <Plus size={16} />
              <span>Agregar</span>
            </Button>
          </div>
  
          {/* Lista de Categorías */}
          <div 
            className="flex-1 overflow-y-auto"
            style={{ 
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px'
            }}
          >
            {categorias.length === 0 ? (
              <div className="p-6 text-center">
                <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm">
                  No hay categorías creadas
                </p>
              </div>
            ) : (
              categorias.map((categoria) => (
                <div 
                  key={categoria.id}
                  onClick={() => setSelectedCategoria(categoria)}
                  className={`flex justify-between items-center px-4 py-3 cursor-pointer transition-colors ${
                    selectedCategoria?.id === categoria.id 
                      ? 'bg-blue-500 bg-opacity-10' 
                      : 'hover:bg-opacity-50'
                  }`}
                  style={{
                    borderBottom: '1px solid var(--color-border)',
                    backgroundColor: selectedCategoria?.id === categoria.id ? 'var(--color-background)' : 'transparent'
                  }}
                >
                  {/* Nombre */}
                  <div className="flex items-center space-x-3">
                    {/* FIX: Se quitó el punto de estado */}
                    <span style={{ color: 'var(--color-text-primary)' }} className="font-medium">
                      {categoria.nombre}
                    </span>
                  </div>
  
                  {/* Acciones de Categoría
                    FIX: Se envuelve en un div con stopPropagation para arreglar el clic
                  */}
                  <div onClick={(e) => e.stopPropagation()}>
                    <Dropdown
                      trigger={
                        <button 
                          className="p-1 rounded transition-colors hover:bg-opacity-20"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          <MoreHorizontal size={16} />
                        </button>
                      }
                    >
                      <button 
                        onClick={() => handleEditCategoria(categoria)}
                        className="flex items-center space-x-2 px-3 py-2 text-sm w-full text-left transition-colors hover:bg-opacity-10"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        <Edit size={14} />
                        <span>Editar categoría</span>
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(categoria, 'categoria')}
                        className="flex items-center space-x-2 px-3 py-2 text-sm w-full text-left transition-colors hover:bg-opacity-10"
                        style={{ color: 'var(--color-error)' }}
                      >
                        <Trash2 size={14} />
                        <span>Eliminar</span>
                      </button>
                    </Dropdown>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>
  
        {/* === COLUMNA DETALLE (DERECHA) - SUBCATEGORÍAS === 
          FIX: Ocupa todo el ancho en móvil (w-full) y 2/3 en desktop (lg:w-2/3)
        */}
        <div className="w-full lg:w-2/3 flex flex-col">
          {selectedCategoria ? (
            <>
              {/* Encabezado de la columna */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium truncate" style={{ color: 'var(--color-text-primary)' }} title={selectedCategoria.nombre}>
                  Subcategorías de "{selectedCategoria.nombre}"
                </h2>
                <Button 
                  variant="primary" 
                  className="px-3"
                  onClick={handleAddSubcategoria}
                >
                  <Plus size={16} />
                  <span>Agregar</span>
                </Button>
              </div>
  
              {/* Tabla de Subcategorías */}
              <div 
                className="flex-1 overflow-y-auto"
                style={{ 
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              >
                {/* Encabezados de tabla
                  FIX: Se quitó "Descripción" y se ajustaron las columnas (grid-cols-10)
                */}
                <div style={{ 
                  borderBottom: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-background)'
                }} className="grid grid-cols-10 gap-4 px-6 py-4">
                  <div className="col-span-6 text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Nombre</div>
                  <div className="col-span-3 text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Estado</div>
                  <div className="col-span-1 text-sm font-medium text-right" style={{ color: 'var(--color-text-primary)' }}>Acciones</div>
                </div>
  
                {/* Filas de Subcategorías */}
                {selectedCategoria.subcategorias && selectedCategoria.subcategorias.length > 0 ? (
                  selectedCategoria.subcategorias.map((subcategoria) => (
                    <div 
                      key={subcategoria.id} 
                      /* FIX: Se ajustan columnas (grid-cols-10) */
                      className="grid grid-cols-10 gap-4 px-6 py-4 items-center"
                      style={{ borderBottom: '1px solid var(--color-border)' }}
                    >
                      {/* FIX: col-span-6 */}
                      <div className="col-span-6">
                        <span style={{ color: 'var(--color-text-primary)' }} className="font-medium text-sm">{subcategoria.nombre}</span>
                      </div>

                      {/* FIX: Se quita la descripción */}

                      {/* FIX: col-span-3 */}
                      <div className="col-span-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          subcategoria.esta_activo 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          {subcategoria.esta_activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <Dropdown
                          trigger={
                            <button className="p-1 rounded transition-colors hover:bg-opacity-20"
                                    style={{ color: 'var(--color-text-secondary)' }}>
                              <MoreHorizontal size={16} />
                            </button>
                          }
                        >
                          <button 
                            onClick={() => handleEditSubcategoria(subcategoria)}
                            className="flex items-center space-x-2 px-3 py-2 text-sm w-full text-left transition-colors hover:bg-opacity-10"
                            style={{ color: 'var(--color-text-primary)' }}
                          >
                            <Edit size={14} />
                            <span>Editar</span>
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(subcategoria, 'subcategoria')}
                            className="flex items-center space-x-2 px-3 py-2 text-sm w-full text-left transition-colors hover:bg-opacity-10"
                            style={{ color: 'var(--color-error)' }}
                          >
                            <Trash2 size={14} />
                            <span>Eliminar</span>
                          </button>
                        </Dropdown>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center">
                    <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm">
                      No hay subcategorías creadas
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Placeholder si no hay categoría seleccionada
            <div 
              className="w-full h-full flex items-center justify-center"
              style={{ 
                backgroundColor: 'var(--color-card)',
                border: '2px dashed var(--color-border)',
                borderRadius: '8px'
              }}
            >
              <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm font-medium">
                Selecciona una categoría de la izquierda para ver sus subcategorías
              </p>
            </div>
          )}
        </div>
      </div>
  
      {/* Modales (se mantienen igual) */}
      <CategoriaForm
        isOpen={showCategoriaForm}
        onClose={handleFormClose}
        categoria={editingCategoria}
        onSuccess={handleFormSuccess}
      />
  
      <SubcategoriaForm
        isOpen={showSubcategoriaForm}
        onClose={handleFormClose}
        subcategoria={editingSubcategoria}
        categoriaPadre={categoriaPadre}
        categorias={categorias}
        onSuccess={handleFormSuccess}
      />
  
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title={`Eliminar ${itemType === 'categoria' ? 'Categoría' : 'Subcategoría'}`}
        message={`¿Estás seguro de eliminar ${itemType === 'categoria' ? 'la categoría' : 'la subcategoría'} "${itemToDelete?.nombre}"?`}
        confirmText="Eliminar"
        type="danger"
      />
  
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Error"
        message={errorMessage}
      />
    </div>
  );
};

export default CategoriaPage;
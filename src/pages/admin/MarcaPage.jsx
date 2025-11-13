// src/pages/MarcaPage.js
import React, { useState, useMemo } from 'react';
import { Filter, Plus, Edit, Trash2, MoreHorizontal, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Header from '../../components/layout/Header';
import Button from '../../components/ui/Button';
import { useMarcas } from '../../hooks/useMarcas';
import MarcaForm from '../../components/forms/MarcaForm';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import ErrorModal from '../../components/ui/ErrorModal';
import Dropdown from '../../components/ui/Dropdown';

const MarcaPage = () => {
  const { marcas, loading, error, deleteMarca, refetch } = useMarcas();
  const [showForm, setShowForm] = useState(false);
  const [editingMarca, setEditingMarca] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [marcaToDelete, setMarcaToDelete] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Estados para búsqueda, filtros y paginación
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [estadoFilter, setEstadoFilter] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // 🔥 FILTRADO MEJORADO - Busca en todos los campos
  const filteredMarcas = useMemo(() => {
    let filtered = marcas;

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(marca => 
        marca.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        marca.pais_origen?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        marca.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por estado
    if (estadoFilter !== 'todos') {
      filtered = filtered.filter(marca => 
        estadoFilter === 'activos' ? marca.esta_activo : !marca.esta_activo
      );
    }

    return filtered;
  }, [marcas, searchTerm, estadoFilter]);

  // 🔥 PAGINACIÓN
  const paginatedMarcas = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMarcas.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMarcas, currentPage]);

  const totalPages = Math.ceil(filteredMarcas.length / itemsPerPage);

  const handleEdit = (marca) => {
    setEditingMarca(marca);
    setShowForm(true);
  };

  const handleDeleteClick = (marca) => {
    setMarcaToDelete(marca);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteMarca(marcaToDelete.id);
      await refetch();
      setShowDeleteModal(false);
      setMarcaToDelete(null);
    } catch (error) {
      setErrorMessage('Error al eliminar la marca');
      setShowErrorModal(true);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingMarca(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    refetch();
    setCurrentPage(1);
  };

  const handleAddMarca = () => {
    setEditingMarca(null);
    setShowForm(true);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleEstadoFilter = (estado) => {
    setEstadoFilter(estado);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setEstadoFilter('todos');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (loading && marcas.length === 0) return (
    <div className="min-h-full flex items-center justify-center">
      <div style={{ color: 'var(--color-text-secondary)' }}>Cargando marcas...</div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-full flex items-center justify-center">
      <div style={{ color: 'var(--color-error)' }}>Error: {error}</div>
    </div>
  );

  return (
    <div className="min-h-full">
      <Header breadcrumb={['Dashboard', 'Marcas']} />

      <div className="px-6 py-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
              Marcas
            </h1>
            <p className="mt-1 text-sm tracking-tight" style={{ color: 'var(--color-text-secondary)' }}>
              Listado de las marcas de productos
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="secondary" 
              className="px-3"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} />
              <span>Filtrar</span>
            </Button>
            <Button 
              variant="primary" 
              className="px-3"
              onClick={handleAddMarca}
            >
              <Plus size={16} />
              <span>Agregar marca</span>
            </Button>
          </div>
        </div>

        {/* 🔥 FILTROS DESPLEGABLES */}
        {showFilters && (
          <div style={{ 
            backgroundColor: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px'
          }} className="p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium" style={{ color: 'var(--color-text-primary)' }}>Filtros</h3>
              <button 
                onClick={handleClearFilters}
                className="text-sm flex items-center space-x-1"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <X size={14} />
                <span>Limpiar</span>
              </button>
            </div>
            <div className="flex space-x-4">
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                  Estado
                </label>
                <div className="flex space-x-2">
                  {['todos', 'activos', 'inactivos'].map((estado) => (
                    <button
                      key={estado}
                      onClick={() => handleEstadoFilter(estado)}
                      className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                        estadoFilter === estado 
                          ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-300' 
                          : 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300'
                      }`}
                    >
                      {estado === 'todos' ? 'Todos' : estado === 'activos' ? 'Activos' : 'Inactivos'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TABLA */}
        <div style={{ 
          backgroundColor: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: '8px'
        }}>
          {/* Header con búsqueda MÁS ANCHA */}
          <div className="flex justify-between items-center p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex-1 max-w-2xl"> {/* 🔥 MÁS ANCHO */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: 'var(--color-text-secondary)' }} />
                <input
                  type="text"
                  placeholder="Buscar por nombre, país de origen o descripción..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10 pr-10 py-2 text-sm rounded-lg border focus:outline-none focus:ring-1 transition-colors w-full"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-primary)'
                  }}
                />
                {searchTerm && (
                  <button 
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Encabezados de tabla */}
          <div style={{ 
            borderBottom: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-background)'
          }} className="grid grid-cols-12 gap-4 px-6 py-4">
            <div className="col-span-1 text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>ID</div>
            <div className="col-span-3 text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Nombre</div>
            <div className="col-span-4 text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Descripción</div>
            <div className="col-span-2 text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>País Origen</div>
            <div className="col-span-1 text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Estado</div>
            <div className="col-span-1 text-sm font-medium text-right" style={{ color: 'var(--color-text-primary)' }}>Acciones</div>
          </div>

          {/* Filas de datos */}
          <div>
           {paginatedMarcas.map((marca) => (
  <div 
    key={marca.id}
    style={{ borderBottom: '1px solid var(--color-border)' }}
    className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-opacity-50 transition-colors"
  >
    <div className="col-span-1">
      <span style={{ color: 'var(--color-text-secondary)' }} className="text-sm font-mono">
        {marca.id}
      </span>
    </div>
    <div className="col-span-3">
      <span style={{ color: 'var(--color-text-primary)' }} className="font-medium">
        {marca.nombre}
      </span>
    </div>
    <div className="col-span-4">
      <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm line-clamp-2">
        {/* 🔥 CORREGIDO: Mostrar descripción real */}
        {marca.descripcion || 'Sin descripción'}
      </p>
    </div>
    <div className="col-span-2">
      <span style={{ color: 'var(--color-text-secondary)' }} className="text-sm">
        {/* 🔥 CORREGIDO: Mostrar país_origen real */}
        {marca.pais_origen || 'No especificado'}
      </span>
    </div>
    <div className="col-span-1">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        marca.esta_activo 
          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      }`}>
        {marca.esta_activo ? 'Activo' : 'Inactivo'}
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
          onClick={() => handleEdit(marca)}
          className="flex items-center space-x-2 px-3 py-2 text-sm w-full text-left transition-colors hover:bg-opacity-10"
          style={{ color: 'var(--color-text-primary)' }}
        >
          <Edit size={14} />
          <span>Editar</span>
        </button>
        <button 
          onClick={() => handleDeleteClick(marca)}
          className="flex items-center space-x-2 px-3 py-2 text-sm w-full text-left transition-colors hover:bg-opacity-10"
          style={{ color: 'var(--color-error)' }}
        >
          <Trash2 size={14} />
          <span>Eliminar</span>
        </button>
      </Dropdown>
    </div>
  </div>
))}
          </div>

          {/* PAGINACIÓN */}
          {filteredMarcas.length > 0 && (
            <div className="flex justify-between items-center p-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm">
                Mostrando {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredMarcas.length)} de {filteredMarcas.length}
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

        <MarcaForm
          isOpen={showForm}
          onClose={handleFormClose}
          marca={editingMarca}
          onSuccess={handleFormSuccess}
        />

        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          title="Eliminar Marca"
          message={`¿Estás seguro de eliminar la marca "${marcaToDelete?.nombre}"?`}
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
    </div>
  );
};

export default MarcaPage;
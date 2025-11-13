// src/pages/ModulesPage.js (CORREGIDA)
import React, { useState } from 'react';
import { Filter, Plus } from 'lucide-react';
import Header from '../../components/layout/Header';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import { useModules } from '../../hooks/useModules';
import ModuleForm from '../../components/forms/ModuleForm';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import ErrorModal from '../../components/ui/ErrorModal';

const ModulesPage = () => {
  const { modules, loading, error, deleteModule, refetch } = useModules();
  const [showForm, setShowForm] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleEdit = (module) => {
    const fullModule = modules.find(m => m.name === module.nombre);
    setEditingModule(fullModule);
    setShowForm(true);
  };

  const handleDeleteClick = (module) => {
    const fullModule = modules.find(m => m.name === module.nombre);
    setModuleToDelete(fullModule);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteModule(moduleToDelete.id);
      await refetch();
      setShowDeleteModal(false);
      setModuleToDelete(null);
    } catch (error) {
      setErrorMessage('Error al eliminar el módulo');
      setShowErrorModal(true);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingModule(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    refetch();
  };

  const handleAddModule = () => {
    setEditingModule(null);
    setShowForm(true);
  };

  const handleFilter = () => {
    console.log('Abrir modal de filtros para módulos...');
  };

  if (loading && modules.length === 0) return (
    <div className="min-h-full flex items-center justify-center">
      <div>Cargando módulos...</div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-full flex items-center justify-center">
      <div>Error: {error}</div>
    </div>
  );

  // Preparar datos para la tabla (sin ID)
  const tableData = modules.map(module => ({
    nombre: module.name,
    descripcion: module.description || 'Sin descripción',
    estado: module.is_active ? (
      <span 
        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
        style={{ 
          backgroundColor: 'var(--color-primary)20', 
          color: 'var(--color-primary)',
          border: '1px solid var(--color-primary)30'
        }}
      >
        Activo
      </span>
    ) : (
      <span 
        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
        style={{ 
          backgroundColor: 'var(--color-gray)20', 
          color: 'var(--color-text-secondary)',
          border: '1px solid var(--color-gray)30'
        }}
      >
        Inactivo
      </span>
    )
  }));

  return (
    <div className="min-h-full">
      <Header breadcrumb={['Dashboard', 'Módulos']} />

      <div className="px-6 py-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
              Módulos
            </h1>
            <p className="mt-1 text-sm tracking-tight" style={{ color: 'var(--color-text-secondary)' }}>
              Listado de los módulos del sistema
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="secondary" className="px-3" onClick={handleFilter}>
              <Filter size={16} />
              <span>Filtrar</span>
            </Button>
            <Button 
              variant="primary" 
              className="px-3"
              onClick={handleAddModule}
            >
              <Plus size={16} />
              <span>Agregar módulo</span>
            </Button>
          </div>
        </div>

        <DataTable
          headers={['Nombre', 'Descripción', 'Estado']}
          data={tableData}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          searchable={true}
          pagination={true}
          pageSize={4}
          emptyMessage="No hay módulos creados"
        />

        {/* Modal de formulario */}
        <ModuleForm
          isOpen={showForm}
          onClose={handleFormClose}
          module={editingModule}
          onSuccess={handleFormSuccess}
        />

        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          title="Eliminar Módulo"
          message={`¿Estás seguro de eliminar el módulo "${moduleToDelete?.name}"? Esta acción no se puede deshacer.`}
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

export default ModulesPage;
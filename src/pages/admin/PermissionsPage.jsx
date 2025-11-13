// src/pages/PermissionsPage.js
import React, { useState } from 'react';
import { Filter, Plus } from 'lucide-react';
import Header from '../../components/layout/Header';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import { usePermissions } from '../../hooks/usePermissions';
import PermissionForm from '../../components/forms/PermissionForm';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import ErrorModal from '../../components/ui/ErrorModal';

const PermissionsPage = () => {
  const { permissions, loading, error, deletePermission, refetch } = usePermissions();
  const [showForm, setShowForm] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [permissionToDelete, setPermissionToDelete] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleEdit = (permission) => {
    const fullPermission = permissions.find(p => 
      p.role.display_name === permission.rol && 
      p.module.name === permission.modulo
    );
    setEditingPermission(fullPermission);
    setShowForm(true);
  };

  const handleDeleteClick = (permission) => {
    const fullPermission = permissions.find(p => 
      p.role.display_name === permission.rol && 
      p.module.name === permission.modulo
    );
    setPermissionToDelete(fullPermission);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deletePermission(permissionToDelete.id);
      await refetch();
      setShowDeleteModal(false);
      setPermissionToDelete(null);
    } catch (error) {
      setErrorMessage('Error al eliminar el permiso');
      setShowErrorModal(true);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingPermission(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    refetch();
  };

  const handleAddPermission = () => {
    setEditingPermission(null);
    setShowForm(true);
  };

  const handleFilter = () => {
    console.log('Abrir modal de filtros para permisos...');
  };

  // Función para mostrar los permisos como badges
  const renderPermissions = (permission) => {
    const permissionsList = [];
    if (permission.can_view) permissionsList.push('Ver');
    if (permission.can_create) permissionsList.push('Crear');
    if (permission.can_update) permissionsList.push('Editar');
    if (permission.can_delete) permissionsList.push('Eliminar');
    
    return permissionsList.map(perm => (
      <span 
        key={perm}
        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mr-1 mb-1"
        style={{ 
          backgroundColor: 'var(--color-primary)20', 
          color: 'var(--color-primary)',
          border: '1px solid var(--color-primary)30'
        }}
      >
        {perm}
      </span>
    ));
  };

  if (loading && permissions.length === 0) return (
    <div className="min-h-full flex items-center justify-center">
      <div>Cargando permisos...</div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-full flex items-center justify-center">
      <div>Error: {error}</div>
    </div>
  );

  // Preparar datos para la tabla
  const tableData = permissions.map(permission => ({
    rol: permission.role.display_name,
    modulo: permission.module.name,
    permisos: renderPermissions(permission),
    descripcion: permission.module.description || 'Sin descripción'
  }));

  return (
    <div className="min-h-full">
      <Header breadcrumb={['Dashboard', 'Permisos']} />

      <div className="px-6 py-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
              Permisos
            </h1>
            <p className="mt-1 text-sm tracking-tight" style={{ color: 'var(--color-text-secondary)' }}>
              Gestión de permisos por rol y módulo
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
              onClick={handleAddPermission}
            >
              <Plus size={16} />
              <span>Agregar permiso</span>
            </Button>
          </div>
        </div>

        <DataTable
          headers={['Rol', 'Módulo', 'Permisos', 'Descripción']}
          data={tableData}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          searchable={true}
          pagination={true}
          pageSize={4}
          emptyMessage="No hay permisos creados"
        />

        {/* Modal de formulario */}
        <PermissionForm
          isOpen={showForm}
          onClose={handleFormClose}
          permission={editingPermission}
          onSuccess={handleFormSuccess}
        />

        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          title="Eliminar Permiso"
          message={`¿Estás seguro de eliminar los permisos del rol "${permissionToDelete?.role?.display_name}" sobre el módulo "${permissionToDelete?.module?.name}"?`}
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

export default PermissionsPage;
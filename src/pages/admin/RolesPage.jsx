// src/pages/RolesPage.js (SIMPLIFICADA)
import React, { useState } from 'react';
import { Filter, Plus } from 'lucide-react';
import Header from '../../components/layout/Header';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import { useRoles } from '../../hooks/useRoles';
import RoleForm from '../../components/forms/RoleForm';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import ErrorModal from '../../components/ui/ErrorModal';

const RolesPage = () => {
  const { roles, loading, error, deleteRole, refetch } = useRoles();
  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleEdit = (role) => {
    const fullRole = roles.find(r => r.display_name === role.nombre.props.children);
    setEditingRole(fullRole);
    setShowForm(true);
  };

  const handleDeleteClick = (role) => {
    const fullRole = roles.find(r => r.display_name === role.nombre.props.children);
    setRoleToDelete(fullRole);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteRole(roleToDelete.id);
      await refetch();
      setShowDeleteModal(false);
      setRoleToDelete(null);
    } catch (error) {
      setErrorMessage('Error al eliminar el rol');
      setShowErrorModal(true);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingRole(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    refetch();
  };

  const handleAddRole = () => {
    setEditingRole(null);
    setShowForm(true);
  };

  const handleFilter = () => {
    console.log('Abrir modal de filtros...');
  };

  if (loading && roles.length === 0) return (
    <div className="min-h-full flex items-center justify-center">
      <div>Cargando roles...</div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-full flex items-center justify-center">
      <div>Error: {error}</div>
    </div>
  );

  return (
    <div className="min-h-full">
      <Header breadcrumb={['Dashboard', 'Roles']} />

      <div className="px-6 py-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
              Roles
            </h1>
            <p className="mt-1 text-sm tracking-tight" style={{ color: 'var(--color-text-secondary)' }}>
              Listado de los roles de los usuarios
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
              onClick={handleAddRole}
            >
              <Plus size={16} />
              <span>Agregar rol</span>
            </Button>
          </div>
        </div>

        <DataTable
          headers={['Nombre', 'Descripción']}
          data={roles.map(role => ({
            nombre: <span className="font-medium">{role.display_name}</span>,
            descripcion: role.description || 'Sin descripción'
          }))}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          searchable={true}
          pagination={true}
          pageSize={4}
          emptyMessage="No hay roles creados"
        />

        {/* Modales */}
        <RoleForm
          isOpen={showForm}
          onClose={handleFormClose}
          role={editingRole}
          onSuccess={handleFormSuccess}
          // 🔥 Quitamos el onError, ahora se maneja internamente
        />

        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          title="Eliminar Rol"
          message={`¿Estás seguro de eliminar el rol "${roleToDelete?.display_name}"? Esta acción no se puede deshacer.`}
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

export default RolesPage;
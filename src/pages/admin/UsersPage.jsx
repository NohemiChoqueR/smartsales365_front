// src/pages/UsersPage.js
import React, { useState, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import Header from '../../components/layout/Header';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import DataTable from '../../components/ui/DataTable';
import UserForm from '../../components/forms/UserForm';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import ErrorModal from '../../components/ui/ErrorModal';

// Importamos solo el hook principal que se adapta a tu proyecto
import { useUsers } from '../../hooks/useUsers';
import { useRoles } from '../../hooks/useRoles';

const UsersPage = () => {
  // --- Hooks de datos ---
  // Obtenemos todo de useUsers (estilo useState/useEffect)
  const { users, loading, error, refetch, deleteUser } = useUsers();
  const { roles, loading: rolesLoading } = useRoles();

  // --- Estado de la UI ---
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Estado local para la carga de eliminación
  const [isDeleting, setIsDeleting] = useState(false);

  // --- Estado de Búsqueda y Filtro ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState(''); // Almacena el ID del rol

  // --- Datos Filtrados (Memoizados) ---
  const filteredUsers = useMemo(() => {
    let tempUsers = users;

    // 1. Filtrar por Rol
    if (filterRole) {
    tempUsers = tempUsers.filter(user => user.role && user.role.id === parseInt(filterRole));
    }

    // 2. Filtrar por Término de Búsqueda
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      tempUsers = tempUsers.filter(user =>
        user.nombre.toLowerCase().includes(lowerSearch) ||
        user.apellido.toLowerCase().includes(lowerSearch) ||
        user.email.toLowerCase().includes(lowerSearch)
      );
    }

    return tempUsers;
  }, [users, searchTerm, filterRole]);

  // --- Manejadores de Eventos ---
  const handleEdit = (userRow) => {
    // Buscamos el usuario completo original usando el email (que debe ser único)
    // ya que userRow puede tener datos formateados por la DataTable.
    const fullUser = users.find(u => u.email === userRow.email);
    setEditingUser(fullUser);
    setShowForm(true);
  };

  const handleDeleteClick = (userRow) => {
    const fullUser = users.find(u => u.email === userRow.email);
    setUserToDelete(fullUser);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    
    setIsDeleting(true); // Inicia carga
    try {
      await deleteUser(userToDelete.id); // Usamos la función del hook
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (error) {
      setErrorMessage(`Error al eliminar el usuario: ${error.message || 'Error desconocido'}`);
      setShowErrorModal(true);
    } finally {
      setIsDeleting(false); // Detiene carga
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  // El hook (createUser/updateUser) se encarga de llamar a refetch internamente
  const handleFormSuccess = () => {
    handleFormClose();
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  // --- Renderizado Condicional (Carga y Error) ---
  if (loading && users.length === 0) return (
    <div className="min-h-full flex items-center justify-center">
      <div>Cargando usuarios...</div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-full flex items-center justify-center">
      <div>Error: {error}</div>
    </div>
  );

  // --- Renderizado Principal ---
  return (
    <div className="min-h-full">
      <Header breadcrumb={['Dashboard', 'Usuarios']} />

      <div className="px-6 py-6">
        {/* Encabezado y Botón de Añadir */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
              Usuarios
            </h1>
            <p className="mt-1 text-sm tracking-tight" style={{ color: 'var(--color-text-secondary)' }}>
              Gestiona los usuarios y sus roles en el sistema.
            </p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="primary" 
              className="px-3"
              onClick={handleAddUser}
            >
              <Plus size={16} />
              <span>Agregar usuario</span>
            </Button>
          </div>
        </div>

        {/* Barra de Búsqueda y Filtro */}
        <div className="flex space-x-2 mb-4">
          <div className="flex-grow">
            <Input
              placeholder="Buscar por nombre, apellido o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.g_target.value)}
              icon={<Search size={16} className="text-gray-400" />} 
            />
          </div>
          <div>
            <Select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              disabled={rolesLoading}
            >
              <option value="">{rolesLoading ? 'Cargando...' : 'Todos los roles'}</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.display_name}</option>
              ))}
            </Select>
          </div>
        </div>

        {/* Tabla de Datos */}
        <DataTable
          headers={['Usuario', 'Email', 'Rol', 'Teléfono']}
          data={filteredUsers.map(user => ({
            usuario: (
              <div className="flex items-center">
                <div className="font-medium">{user.nombre} {user.apellido}</div>
              </div>
            ),
            email: user.email,
            rol: (
              <span 
                className="px-2 py-0.5 rounded text-xs font-medium" 
                style={{backgroundColor: 'var(--color-bg-muted)', color: 'var(--color-text-secondary)'}}
              >
                {user.role?.display_name ?? 'Sin Rol'} 
              </span>
            ),
            telefono: user.telefono || 'N/A'
          }))}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          searchable={false} // Usamos nuestro propio buscador
          pagination={true}
          pageSize={4}
          emptyMessage="No se encontraron usuarios"
        />

        {/* --- Modales --- */}
        <UserForm
          isOpen={showForm}
          onClose={handleFormClose}
          user={editingUser}
          onSuccess={handleFormSuccess}
        />

        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          title="Eliminar Usuario"
          message={`¿Estás seguro de eliminar a ${userToDelete?.nombre} ${userToDelete?.apellido}? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          type="danger"
          isLoading={isDeleting} // <- Corregido para usar el estado local
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

export default UsersPage;
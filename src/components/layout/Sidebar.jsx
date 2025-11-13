import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  User, 
  Shield, 
  KeyRound, 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Folder,
  Package,
  Tag,
  LayoutGrid,
  Briefcase,  
  Store,     
  CreditCard, 
  Percent,    
  Megaphone,
  LogOut,
  Brain,
  FileText,
  TrendingUp,
  ShoppingCart,
  Banknote,
  ClipboardList,
  Receipt,
  Home,
  Warehouse,
  Truck
} from 'lucide-react';
import SidebarLink from './SideBarLink';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSection, setOpenSection] = useState(null);

  const { user, logout } = useAuth();

  const getUserInitials = () => {
    if (!user?.nombre || !user?.apellido) return 'U';
    return `${user.nombre.charAt(0)}${user.apellido.charAt(0)}`.toUpperCase();
  };

  const handleLogout = async () => {
    await logout(); // Esto ya debería redirigir a /home si seguiste las correcciones anteriores
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const sections = {
    usuarios: {
      icon: Users,
      title: "Gestión de Usuarios",
      items: [
        { icon: User, text: "Usuarios", to: "/users" },
        { icon: Shield, text: "Roles", to: "/roles" },
        { icon: KeyRound, text: "Permisos", to: "/permissions" },
        { icon: Folder, text: "Módulos", to: "/modules" }
      ]
    },
    productos: {
      icon: Package,
      title: "Gestión de Productos",
      items: [
        { icon: Tag, text: "Marcas", to: "/brands" },
        { icon: LayoutGrid, text: "Categorías", to: "/categories" },
        { icon: Package, text: "Productos", to: "/products" }
      ]
    },
    empresa: {
      icon: Briefcase,
      title: "Gestión de Empresa",
      items: [
        { icon: Store, text: "Sucursales", to: "/branches" },
        { icon: CreditCard, text: "Métodos de Pago", to: "/payment-methods" },
        { icon: Percent, text: "Descuentos", to: "/discounts" },
        { icon: Megaphone, text: "Campañas", to: "/campaigns" }
      ]
    },
    ventas: {
    icon: ShoppingCart,        // Ícono para el grupo: "Ventas" en general
    title: "Gestión de Ventas",
    items: [
      { icon: Receipt, text: "Ventas", to: "/ventas" },
      { icon: ClipboardList, text: "Detalles de Venta", to: "/detalles-venta" },
      { icon: Banknote, text: "Pagos", to: "/pagos" },
      { icon: CreditCard, text: "Métodos de Pago", to: "/metodos-pago" }
    ]
  },
  envios: {
    icon: Truck,         // Ícono para el grupo: Logística/Transporte
    title: "Gestión de Envíos",
    items: [
      { icon: Warehouse, text: "Agencias", to: "/agencias" },
      { icon: Package, text: "Envíos", to: "/envios" },
      { icon: Home, text: "Mis Direcciones", to: "/mis-direcciones" }
    ]
  }
  };

  return (
    <aside 
      className={`h-screen flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
      style={{
        backgroundColor: 'var(--color-card)',
        borderRight: '1px solid var(--color-border)'
      }}
    >
      {/* Header del Sidebar */}
      <div 
        className="p-3 flex items-center justify-between"
        style={{
          borderBottom: '1px solid var(--color-border)'
        }}
      >
        {!isCollapsed && (
          <h1 
            className="text-xl font-bold tracking-tight"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Smart Sales
          </h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg transition-colors"
          style={{
            color: 'var(--color-text-secondary)',
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'var(--color-surface)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
          }}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
      
      {/* Navegación */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {/* Dashboard siempre visible */}
        <SidebarLink 
          icon={LayoutDashboard} 
          text="Dashboard" 
          to="/dashboard"
          collapsed={isCollapsed}
        />
        <SidebarLink 
          icon={TrendingUp} 
          text="Predicciones" 
          to="/inteligencia"
          collapsed={isCollapsed}
        />
        {/* --- ¡NUEVA PÁGINA DE REPORTES AÑADIDA! --- */}
        <SidebarLink 
          icon={FileText} 
          text="Reportes" 
          to="/reportes"
          collapsed={isCollapsed}
        />
                {/* --- ¡ENLACE ACTUALIZADO! --- */}
        <SidebarLink 
          icon={Brain} 
          text="Analisis" 
          to="/analytics"  // <-- APUNTA A LA NUEVA PÁGINA
          collapsed={isCollapsed}
        />
        {/* Secciones dinámicas */}
        {Object.entries(sections).map(([key, section]) => (
          <div key={key}>
            {/* Botón principal de la sección */}
            <button
              onClick={() => toggleSection(key)}
              className={`flex items-center justify-between w-full p-2 rounded-lg transition-colors mb-1 ${
                isCollapsed ? 'justify-center' : ''
              }`}
              style={{
                color: 'var(--color-text-secondary)',
                backgroundColor: openSection === key ? 'var(--color-surface)' : 'transparent'
              }}
              onMouseEnter={(e) => {
                if (openSection !== key) {
                  e.target.style.backgroundColor = 'var(--color-surface)';
                  e.target.style.color = 'var(--color-text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (openSection !== key) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'var(--color-text-secondary)';
                }
              }}
            >
              <div className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center' : ''}`}>
                <section.icon size={20} style={{ color: 'var(--color-text-secondary)' }} />
                {!isCollapsed && (
                  <span className="text-sm font-medium">{section.title}</span>
                )}
              </div>
              {!isCollapsed && (
                <ChevronDown 
                  size={16} 
                  style={{ color: 'var(--color-text-secondary)' }}
                  className={`transition-transform ${openSection === key ? 'rotate-180' : ''}`} 
                />
              )}
            </button>
            
            {/* SUB-ITEMS - Funciona igual en ambos modos */}
            {openSection === key && (
              <div className={`space-y-1 mb-2 ${!isCollapsed ? 'pl-6 ml-3' : ''}`}
                style={!isCollapsed ? { borderLeft: '1px solid var(--color-border)' } : {}}
              >
                {section.items.map((item, index) => (
                  <SidebarLink 
                    key={index}
                    icon={item.icon} 
                    text={item.text} 
                    to={item.to}
                    collapsed={isCollapsed}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User info - Versión expandida */}
      {!isCollapsed && (
        <div 
          className="p-4"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <div className="flex items-center space-x-3">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center font-medium text-xs"
              style={{ 
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-primary)'
              }}
            >
              {getUserInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <p 
                className="text-sm font-medium truncate"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {user?.nombre} {user?.apellido}
              </p>
              <p 
                className="text-xs capitalize truncate"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {user?.role?.toLowerCase()}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full mt-2 text-left p-2 text-sm rounded-lg transition-colors"
            style={{
              color: 'var(--color-text-secondary)',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--color-surface)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      )}

      {/* User info - Versión colapsada */}
      {isCollapsed && (
        <div className="p-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex flex-col items-center space-y-2">
            <button 
              className="w-8 h-8 rounded-full flex items-center justify-center font-medium text-xs transition-colors"
              style={{ 
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-primary)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--color-primary)';
                e.target.style.color = 'var(--color-background)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--color-surface)';
                e.target.style.color = 'var(--color-text-primary)';
              }}
              title={`${user?.nombre} ${user?.apellido}`}
              onClick={() => window.location.href = '/profile'}
            >
              {getUserInitials()}
            </button>
            <button
              onClick={handleLogout} 
              className="p-1.5 rounded-lg transition-colors"
              style={{
                color: 'var(--color-text-secondary)',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--color-surface)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
              title="Cerrar Sesión"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
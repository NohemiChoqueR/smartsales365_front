import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu } from 'lucide-react';

// --- Importa tus Hooks ---
import { useProductos } from '../../hooks/useProducto.jsx';
import { useCategorias } from '../../hooks/useCategorias.jsx';
import { useMarcas } from '../../hooks/useMarcas.jsx';

// --- Importa tus Componentes ---
import { ProductCard } from '../../components/product/ProductCard.jsx';
// ¡Ahora importamos el componente REAL!
import { FilterSidebar } from '../../components/product/FilterSidebar.jsx'; 

// --- Página Principal del Catálogo de Productos ---
const ProductPage = () => {
  // 1. --- MANEJO DE ESTADO DE LA URL ---
  const [searchParams, setSearchParams] = useSearchParams();

  // 2. --- CONVERSIÓN DE PARAMS A OBJETO DE FILTROS ---
  const filters = Object.fromEntries(searchParams.entries());

  // 3. --- LLAMADA A LOS HOOKS CON LOS FILTROS ---
  const { productos, loading, error } = useProductos(filters);
  
  const { 
    categoriasConSubcategoriasVisibles, 
    loading: loadingCategorias 
  } = useCategorias();
  
  // 🔥 ¡NUEVO! Llamamos al hook de marcas
  const { marcas, loading: loadingMarcas } = useMarcas();

  // 4. --- HANDLERS (Manejadores de eventos) ---

  const handleFilterChange = (key, value) => {
    setSearchParams(prevParams => {
      const newParams = new URLSearchParams(prevParams);
      if (value === null || value === '' || value === false) {
        newParams.delete(key); 
      } else {
        newParams.set(key, value);
      }
      // Cuando un filtro cambia, reseteamos a la página 1
      newParams.set('page', '1'); 
      return newParams;
    });
  };

  const handlePageChange = (newPage) => {
     setSearchParams(prevParams => {
        const newParams = new URLSearchParams(prevParams);
        newParams.set('page', newPage); 
        return newParams;
    });
  }

  const handleAddToCart = (product) => {
    console.log('Agregando al carrito (desde ProductPage):', product.nombre);
  };
  
  const [searchTerm, setSearchTerm] = useState(filters.nombre || '');
  const handleSearch = (e) => {
    e.preventDefault();
    handleFilterChange('nombre', searchTerm);
  };

  // Combinamos los estados de carga
  const sidebarLoading = loadingCategorias || loadingMarcas;

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* --- 1. Header (Reutilizado de HomePage) --- */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        {/* ... (Tu header... sin cambios) ... */}
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600 tracking-tight">
            Smart<span className="text-gray-800">Sales 365</span>
          </Link>
          <form onSubmit={handleSearch} className="hidden md:flex relative w-full max-w-lg">
            <input
              type="text"
              placeholder="Buscar en el catálogo..."
              className="w-full py-2 pl-4 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400">
              <Search />
            </button>
          </form>
          <nav className="flex items-center space-x-4">
            <Link to="/login" className="hidden sm:flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors">
              <User size={20} />
              <span className="text-sm font-medium">Login</span>
            </Link>
            <Link to="/carrito" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors">
              <ShoppingCart size={20} />
              <span className="text-sm font-medium hidden sm:inline">Carrito</span>
            </Link>
            <button className="md:hidden p-2 text-gray-600 hover:text-blue-600">
              <Menu size={24} />
            </button>
          </nav>
        </div>
      </header>

      {/* --- 2. Main Content (Catálogo) --- */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Nuestro Catálogo</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
        
          {/* --- Columna de Filtros (Sidebar) --- */}
          <aside className="w-full md:w-1/4 lg:w-1/5">
            <FilterSidebar 
              categorias={categoriasConSubcategoriasVisibles} 
              marcas={marcas} // 🔥 ¡NUEVO! Pasamos las marcas
              loading={sidebarLoading} // 🔥 ¡NUEVO! Usamos el loading combinado
              currentFilters={filters}
              onFilterChange={handleFilterChange}
            />
          </aside>
          
          {/* --- Columna de Productos (Grid) --- */}
          <section className="w-full md:w-3/4 lg:w-4/5">
            {/* ... (El resto de la sección de productos... sin cambios) ... */}
            {loading && (
              <div className="text-center p-10">Cargando productos...</div>
            )}
            {error && (
              <div className="text-center p-10 text-red-600">
                <p>Hubo un error al cargar los productos:</p>
                <p>{error}</p>
              </div>
            )}
            
            {!loading && !error && (
              <>
                {productos.length === 0 && (
                  <div className="text-center p-10 bg-white rounded-lg shadow-sm border">
                    <h3 className="text-xl font-semibold text-gray-700">No se encontraron productos</h3>
                    <p className="text-gray-500 mt-2">Intenta ajustar tus filtros de búsqueda.</p>
                  </div>
                )}
              
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {productos.map(product => (
                    <ProductCard 
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
                
                {productos.length > 0 && (
                  <div className="mt-8 flex justify-center items-center space-x-2">
                    <button 
                      onClick={() => handlePageChange(parseInt(filters.page || '1') - 1)}
                      disabled={!filters.page || parseInt(filters.page) <= 1}
                      className="px-4 py-2 border rounded-lg bg-white shadow-sm disabled:opacity-50"
                    >
                      Anterior
                    </button>
                    <span className="text-sm text-gray-700">Página {filters.page || '1'}</span>
                    <button 
                      onClick={() => handlePageChange(parseInt(filters.page || '1') + 1)}
                      className="px-4 py-2 border rounded-lg bg-white shadow-sm"
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>

      {/* --- 3. Footer (Reutilizado de HomePage) --- */}
      <footer className="bg-gray-800 text-gray-300 py-12 mt-16">
        {/* ... (Tu footer... sin cambios) ... */}
         <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">SmartSales 365</h3>
            <p className="text-sm">Tu tienda de confianza para electrodomésticos y tecnología.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Ayuda</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/faq" className="hover:text-white">Preguntas Frecuentes</Link></li>
              <li><Link to="/como-comprar" className="hover:text-white">Cómo comprar</Link></li>
              <li><Link to="/envios" className="hover:text-white">Envíos y Devoluciones</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/terminos" className="hover:text-white">Términos y Condiciones</Link></li>
              <li><Link to="/privacidad" className="hover:text-white">Políticas de Privacidad</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm">
              <li>Email: info@smartsales.com</li>
              <li>Teléfono: +51 1 234 5678</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} SmartSales365. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default ProductPage;
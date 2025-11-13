import React, { useState } from 'react';
import { Search, ShoppingCart, User, Menu, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom'; // Para los enlaces de navegación

// --- Importa tus Hooks ---
import { useProductos } from '../hooks/useProducto';
import { useCategorias } from '../hooks/useCategorias';

// --- Importa tus Componentes ---
import { ProductCard } from '../components/product/ProductCard';
import { CategoryCard } from '../components/product/CategoryCard';
import { HeroCarousel } from './Hero';
// (Aquí también importarías componentes de Carga/Skeleton si los tuvieras)

// --- Componente Principal de la Página de Inicio ---
const HomePage = () => {
  // --- 1. Llama a los Hooks ---
  const { 
    productos, 
    loading: loadingProductos, 
    error: errorProductos 
  } = useProductos(); // Este hook (sin filtros) trae todos los productos
  
  const { 
    categoriasVisibles, 
    loading: loadingCategorias, 
    error: errorCategorias 
  } = useCategorias();

  // Estado local para la búsqueda (aún no implementada, pero lista)
  const [searchTerm, setSearchTerm] = useState('');

  // --- 2. Define Handlers (Manejadores de eventos) ---
  const handleAddToCart = (product) => {
    console.log('Agregando al carrito:', product.nombre);
    // TODO: Implementar la lógica del contexto del carrito
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Buscando:', searchTerm);
    // TODO: Implementar lógica de búsqueda
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* 1. Header (Navegación Pública) */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600 tracking-tight">
            Smart<span className="text-gray-800">Sales 365</span>
          </Link>
          
          {/* Barra de Búsqueda (Desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex relative w-full max-w-lg">
            <input
              type="text"
              placeholder="Buscar productos, marcas y más..."
              className="w-full py-2 pl-4 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400">
              <Search />
            </button>
          </form>

          {/* Iconos de Navegación */}
          <nav className="flex items-center space-x-4">
            <Link to="/login" className="hidden sm:flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors">
              <User size={20} />
              <span className="text-sm font-medium">Login</span>
            </Link>
            <Link to="/register" className="hidden sm:flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors">
              <span className="text-sm font-medium">Register</span>
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
        {/* Barra de Búsqueda (Mobile) */}
        <form onSubmit={handleSearch} className="md:hidden p-4 border-t border-gray-100">
           <div className="relative w-full">
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full py-2 pl-4 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400">
              <Search />
            </button>
          </div>
        </form>
      </header>

      {/* 2. Main Content */}
      <main className="container mx-auto px-4 py-8">
        
            <HeroCarousel />

        {/* Categorías Principales (CON DATOS REALES) */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Nuestras Categorías</h2>
          
          {loadingCategorias && (
            <div className="text-center p-4">Cargando categorías...</div>
          )}
          {errorCategorias && (
            <div className="text-center p-4 text-red-600">{errorCategorias}</div>
          )}

          {!loadingCategorias && !errorCategorias && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categoriasVisibles.map(category => (
                // Ahora usa el componente inteligente que creamos
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          )}
        </section>

        {/* Productos Destacados (CON DATOS REALES) */}
        <section id="productos" className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Productos Destacados</h2>
          
          {loadingProductos && (
            <div className="text-center p-4">Cargando productos...</div>
          )}
          {errorProductos && (
            <div className="text-center p-4 text-red-600">{errorProductos}</div>
          )}

          {!loadingProductos && !errorProductos && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                
                {/* 🔥 CAMBIO 1: Limitar productos a 8 */}
                {productos.slice(0, 8).map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
              
              {/* 🔥 CAMBIO 2: Botón para ver el catálogo completo */}
              <div className="text-center mt-10">
                <Link
                  to="/catalogo"
                  className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center space-x-2 mx-auto w-fit"
                >
                  <span>Ver todo el catálogo</span>
                  <ChevronRight size={16} />
                </Link>
              </div>
            </>
          )}
        </section>

      </main>

      {/* 3. Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        {/* ... (contenido del footer sin cambios) ... */}
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">SmartSales 365</h3>
            <p className="text-sm">Tu tienda de confianza para electrodomésticos y tecnología.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Categorías</h4>
            <ul className="space-y-2 text-sm">
              {categoriasVisibles.slice(0, 4).map(cat => (
                <li key={cat.id}>
                  <Link 
                    // 🔥 CAMBIO 3: Hacemos que los links del footer también sean inteligentes
                    to={cat.subcategorias?.[0]?.id ? `/catalogo?subcategoria=${cat.subcategorias[0].id}` : '/catalogo'} 
                    className="hover:text-white"
                  >
                    {cat.nombre}
                  </Link>
                </li>
              ))}
            </ul>
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
            <h4 className="text-lg font-semibold text-white mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm">
              <li>Email: info@smartsales.com</li>
              <li>Teléfono: +51 1 234 5678</li>
              <li>Dirección: Av. Siempre Viva 123</li>
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

export default HomePage;
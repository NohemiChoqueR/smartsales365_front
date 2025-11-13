// En modules/products/components/ProductCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
// NOTA: Asegúrate de tener 'lucide-react' y 'react-router-dom' instalados

/**
 * Genera una URL de placeholder.co usando el SKU.
 * (Lógica de tu Card 2)
 */
const generatePlaceholderUrl = (sku) => {
  const text = encodeURIComponent(sku);
  return `https://placehold.co/400x300/E5E7EB/4B5563/png?text=${text}`;
};

/**
 * Formateador de moneda para Soles Peruanos (PEN).
 * (Lógica de tu Card 2)
 */
const currencyFormatter = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
});

/**
 * Tarjeta de Producto con el estilo de la Card 1 y la lógica de la Card 2.
 */
export const ProductCard = ({ product, onAddToCart }) => {
  
  // --- Lógica de Datos (de tu Card 2) ---
  const {
    id, // Asegúrate de que 'product' tenga un 'id' para el Link
    nombre,
    precio_venta,
    subcategoria_nombre,
    marca_nombre, // 'marca_nombre' es usado por el estilo de la Card 1
    sku,
    imagenes,
    esta_activo = true, // Asumimos 'true' si no viene, como en la Card 1
  } = product;

  // Lógica de Imagen (de tu Card 2)
  const imageUrl =
    imagenes && imagenes.length > 0
      ? imagenes[0].imagen_url // Usamos la imagen real
      : generatePlaceholderUrl(sku || id.toString()); // Fallback a placeholder

  // Lógica de Precio (de tu Card 2)
  const formattedPrice = currencyFormatter.format(precio_venta);

  // Lógica de Disponibilidad (del estilo de Card 1)
  const isAvailable = esta_activo;

  // --- Manejadores de Eventos (Fusionados) ---

  // Manejador del Carrito:
  // Usa e.preventDefault() (de Card 1) para que el Link no navegue
  // Llama a onAddToCart(product) (de Card 2)
  const handleAddToCart = (e) => {
    e.preventDefault(); // ¡MUY IMPORTANTE! Evita que el <Link> navegue

    if (!isAvailable) {
      alert('Producto no disponible o inactivo');
      return;
    }

    if (onAddToCart) {
      onAddToCart(product); // Llama a tu función de la prop
      alert(`Agregado al carrito: ${nombre}`); // Feedback opcional
    } else {
      console.warn('onAddToCart prop no fue proveída a ProductCard');
    }
  };

  // Manejador de Favoritos (Placeholder de Card 1)
  const handleToggleFavorite = (e) => {
    e.preventDefault(); // Evita que el <Link> navegue
    alert('Agregado a favoritos (placeholder)');
  };

  // --- Renderizado (Estilo de Card 1) ---
  return (
    <div className="group">
      <Link
        // Usamos el ID para la navegación
        // Ajusta la ruta a tu configuración de rutas (ej. /productos/123)
        to={`/product/${id}`}
        className="block bg-white overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 "
        style={{
          boxShadow:
            '0 4px 6px rgba(0, 0, 0, 0.07), 0 10px 15px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Contenedor de Imagen */}
        <div className="relative h-40 md:h-44 lg:h-48 overflow-hidden bg-white rounded-t-lg flex items-center justify-center">
          <img
            // Usamos la URL de tu lógica (Card 2)
            src={imageUrl}
            alt={nombre}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          />

          {/* Actions (Estilo de Card 1) */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleToggleFavorite}
              className="p-2.5 bg-white shadow-lg hover:bg-accent-cream hover:text-accent-chocolate transition-all duration-200 hover:scale-110"
              title="Agregar a favoritos"
            >
              <Heart size={20} />
            </button>
            <button
              onClick={handleAddToCart} // Usamos tu lógica de Card 2
              disabled={!isAvailable}
              className="p-2.5 bg-white shadow-lg hover:bg-accent-cream hover:text-accent-chocolate transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Agregar al carrito"
            >
              <ShoppingCart size={20} />
            </button>
          </div>
        </div>

        {/* Info (Estilo de Card 1, Datos de Card 2) */}
        <div className="p-5 bg-white">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-1.5 font-semibold">
            {/* Usamos marca_nombre (de Card 1) o subcategoria_nombre (de Card 2) */}
            {marca_nombre || subcategoria_nombre || 'Categoría'}
          </p>
          <h3 className="text-base font-semibold text-text-important mb-1.5 line-clamp-2 group-hover:text-accent-chocolate transition-colors">
            {nombre}
          </h3>
          <p className="text-sm text-text-secondary mb-3">
            {/* Mostramos la subcategoría aquí, como en la Card 1 */}
            {subcategoria_nombre}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-accent-chocolate">
              {/* Usamos el precio formateado (de Card 2) */}
              {formattedPrice}
            </span>
            {!isAvailable && (
              <span className="text-xs text-error font-semibold bg-error/10 px-2 py-1">
                No disponible
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};
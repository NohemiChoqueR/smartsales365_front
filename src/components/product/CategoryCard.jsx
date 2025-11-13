import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Tarjeta de Categoría que enlaza a la página de catálogo
 * con la primera subcategoría pre-filtrada.
 */
export const CategoryCard = ({ category }) => {
  const { nombre, imagen_url, subcategorias } = category;

  // --- Lógica del Enlace ---
  // 1. Buscamos la primera subcategoría (tu hook ya las filtra por 'esta_activo')
  const firstSubcategory = subcategorias && subcategorias.length > 0
    ? subcategorias[0]
    : null;

  // 2. Construimos la URL de destino
  const targetUrl = firstSubcategory
    ? `/catalogo?subcategoria=${firstSubcategory.id}`
    : '/catalogo'; // Fallback por si una categoría no tiene subcategorías

  // 3. Usamos un placeholder si la API no trae imagen
  const imageUrl = imagen_url 
    ? imagen_url 
    : `https://placehold.co/600x400/e0f2fe/0891b2?text=${encodeURIComponent(nombre)}`;

  return (
    <div className="relative group w-full h-40 rounded-lg overflow-hidden shadow-md">
      <img 
        src={imageUrl} 
        alt={nombre} 
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
        <h3 className="text-white text-xl font-bold tracking-wide p-4 text-center">
          {nombre}
        </h3>
      </div>
      
      {/* El enlace inteligente usa react-router-dom */}
      <Link 
        to={targetUrl} 
        className="absolute inset-0" 
        aria-label={`Ver ${nombre}`}
      />
    </div>
  );
};
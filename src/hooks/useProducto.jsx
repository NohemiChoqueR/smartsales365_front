import { useState, useEffect } from 'react';
import { productoService } from '../services/producto.service';

/**
 * Hook para gestionar el estado de los Productos en React.
 * Acepta un objeto de filtros para pasarlo a la API.
 */
export const useProductos = (filters = {}) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Convertimos 'filters' en un string estable para usarlo como
  // dependencia en useEffect. Esto evita re-cargas innecesarias
  // si el objeto 'filters' es nuevo pero tiene el mismo contenido.
  const filtersString = JSON.stringify(filters);

  useEffect(() => {
    // 🔥 CORRECCIÓN:
    // Movemos la función fetchProductos DENTRO del useEffect.
    // Esto garantiza que siempre tenga acceso a la última
    // versión de 'filters' y evitamos problemas de "stale state".
    const fetchProductos = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Re-parseamos los filtros desde el string estable.
        const currentFilters = JSON.parse(filtersString);

        // 2. Convertimos el objeto de filtros a un query string.
        //    Ej: { subcategoria: 1 } se vuelve "subcategoria=1"
        const queryString = new URLSearchParams(currentFilters).toString();

        // 3. ¡Añadimos un log para depurar!
        //    Revisa la consola de tu navegador (F12) para ver esto.
        console.log(`[useProductos] 🚀 Fetching /api/producto/?${queryString}`);

        // 4. Pasamos el query string al servicio.
        const data = await productoService.getProductos(queryString);
        setProductos(data);
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Error al cargar productos';
        setError(errorMsg);
        console.error('[useProductos] ❌ Error:', errorMsg);
      } finally {
        setLoading(false);
      }
    };

    // Llamamos a la función que acabamos de definir.
    fetchProductos();

  }, [filtersString, productoService]); // Dependemos del string de filtros y del servicio

  // ... (el resto de tus funciones create, update, delete) ...
  // (Las omito aquí por brevedad, pero deben seguir en tu archivo)

  const createProducto = async (productoData) => {
    try {
      const newProducto = await productoService.createProducto(productoData);
      setProductos(prev => [...prev, newProducto]);
      return newProducto;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  const updateProducto = async (id, productoData) => {
    try {
      const updatedProducto = await productoService.updateProducto(id, productoData);
      setProductos(prev => prev.map(p => (p.id === id ? updatedProducto : p)));
      return updatedProducto;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  const deleteProducto = async (id) => {
    try {
      await productoService.deleteProducto(id);
      setProductos(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      throw err.response?.data || err;
    }
  };


  return {
    productos,
    loading,
    error,
    refetch: () => {}, // fetchProductos ya no es accesible directamente, pero se re-ejecuta con los filtros
    createProducto,
    updateProducto,
    deleteProducto
  };
};
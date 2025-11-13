// src/hooks/useCategorias.jsx
import { useState, useEffect, useCallback } from 'react';
import { categoriaService } from '../services/categoria.service';

export const useCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔥 PRIMERO definir fetchCategorias - MOVER AL INICIO
  const fetchCategorias = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoriaService.getAll();
      setCategorias(data);
    } catch (err) {
      setError('Error al cargar categorías');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔥 LUEGO los useCallbacks que dependen de estados
  const getSubcategoriasVisibles = useCallback(() => {
    return subcategorias.filter(subcat => {
      const categoriaPadre = categorias.find(cat => cat.id === subcat.categoria);
      return categoriaPadre?.esta_activo && subcat.esta_activo;
    });
  }, [categorias, subcategorias]);

  const getCategoriasConSubcategoriasVisibles = useCallback(() => {
    return categorias
      .filter(cat => cat.esta_activo)
      .map(cat => ({
        ...cat,
        subcategorias: cat.subcategorias?.filter(subcat => subcat.esta_activo) || []
      }));
  }, [categorias]);

  // 🔥 LUEGO las demás funciones
  const fetchSubcategorias = async () => {
    try {
      const data = await categoriaService.getAllSubcategorias();
      setSubcategorias(data);
    } catch (err) {
      throw err;
    }
  };

  const createCategoria = async (categoriaData) => {
    try {
      const newCategoria = await categoriaService.create(categoriaData);
      setCategorias(prev => [...prev, newCategoria]);
      return newCategoria;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  const updateCategoria = async (id, categoriaData) => {
    try {
      const updatedCategoria = await categoriaService.update(id, categoriaData);
      
      setCategorias(prev => prev.map(cat => 
        cat.id === id ? updatedCategoria : cat
      ));

      if (categoriaData.esta_activo === false) {
        const subcategoriasDeCategoria = subcategorias.filter(
          subcat => subcat.categoria === id && subcat.esta_activo
        );
        
        for (const subcat of subcategoriasDeCategoria) {
          await categoriaService.updateSubcategoria(subcat.id, {
            ...subcat,
            esta_activo: false
          });
        }

        setSubcategorias(prev => prev.map(subcat =>
          subcat.categoria === id ? { ...subcat, esta_activo: false } : subcat
        ));
      }

      return updatedCategoria;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  const deleteCategoria = async (id) => {
    try {
      await categoriaService.delete(id);
      setCategorias(prev => prev.filter(cat => cat.id !== id));
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  const createSubcategoria = async (subcategoriaData) => {
    try {
      const categoriaPadre = categorias.find(cat => cat.id === subcategoriaData.categoria);
      if (!categoriaPadre) {
        throw new Error('La categoría padre no existe');
      }
      if (!categoriaPadre.esta_activo) {
        throw new Error('No se puede crear subcategoría en categoría inactiva');
      }

      const newSubcategoria = await categoriaService.createSubcategoria(subcategoriaData);
      
      setSubcategorias(prev => [...prev, newSubcategoria]);
      setCategorias(prev => prev.map(cat => 
        cat.id === newSubcategoria.categoria 
          ? { 
              ...cat, 
              subcategorias: [...(cat.subcategorias || []), newSubcategoria] 
            }
          : cat
      ));
      
      return newSubcategoria;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  const updateSubcategoria = async (id, subcategoriaData) => {
    try {
      const updatedSubcategoria = await categoriaService.updateSubcategoria(id, subcategoriaData);
      
      setSubcategorias(prev => prev.map(subcat =>
        subcat.id === id ? updatedSubcategoria : subcat
      ));
      
      setCategorias(prev => prev.map(cat => ({
        ...cat,
        subcategorias: cat.subcategorias?.map(subcat =>
          subcat.id === id ? updatedSubcategoria : subcat
        ) || []
      })));

      return updatedSubcategoria;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  const deleteSubcategoria = async (id) => {
    try {
      await categoriaService.deleteSubcategoria(id);
      setSubcategorias(prev => prev.filter(subcat => subcat.id !== id));
      
      setCategorias(prev => prev.map(cat => ({
        ...cat,
        subcategorias: cat.subcategorias?.filter(subcat => subcat.id !== id) || []
      })));
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  // 🔥 POR ÚLTIMO el useEffect
  useEffect(() => {
    fetchCategorias();
  }, []);

  return {
    // Estados
    categorias,
    subcategorias,
    loading,
    error,
    
    // Datos filtrados
    categoriasVisibles: categorias.filter(cat => cat.esta_activo),
    subcategoriasVisibles: getSubcategoriasVisibles(),
    categoriasConSubcategoriasVisibles: getCategoriasConSubcategoriasVisibles(),
    
    // Métodos categorías
    refetchCategorias: fetchCategorias,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    
    // Métodos subcategorías
    refetchSubcategorias: fetchSubcategorias,
    createSubcategoria,
    updateSubcategoria,
    deleteSubcategoria,
    
    // Métodos utilitarios
    getSubcategoriasByCategoria: (categoriaId) => 
      categoriaService.getSubcategoriasByCategoria(categoriaId)
  };
};
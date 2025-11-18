// src/pages/admin/graph/FiltrosPrediccionIA.jsx
import React, { useEffect, useState } from "react";
import api from "../../../services/api.service";

export default function FiltrosPrediccionIA({
  dias, categoriaId, productoId,
  setDias, setCategoriaId, setProductoId,
  onFiltrar
}) {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);

  // ================================
  // 🔹 1. Cargar CATEGORÍAS
  // ================================
  useEffect(() => {
    api.get("/categoria/")
      .then(res => setCategorias(res.data || []))
      .catch(err => console.error("Error cargando categorías:", err));
  }, []);

  // ================================
  // 🔹 2. Cargar PRODUCTOS según categoría (DEPENDIENTE)
  //     **IGUAL QUE EN Dashboard2**
  // ================================
  useEffect(() => {
    const url = categoriaId
      ? `/producto/?categoria=${categoriaId}`   // 👈 MISMO PARAM QUE EN DASHBOARD2
      : `/producto/`;

    api.get(url)
      .then(res => {
        setProductos(res.data || []);
        // Si se cambia de categoría, reseteamos producto
        if (categoriaId) setProductoId("");
      })
      .catch(err => console.error("Error cargando productos:", err));

  }, [categoriaId, setProductoId]);

  return (
    <div className="bg-white p-6 rounded-xl shadow border">
      <h2 className="text-xl font-semibold mb-4">Filtros de Predicción</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* DÍAS */}
        <div>
          <label className="block text-sm font-medium mb-1">Días a predecir</label>
          <select
            value={dias}
            onChange={e => setDias(e.target.value)}
            className="p-2 border rounded-md w-full"
          >
            <option value="7">7 días</option>
            <option value="15">15 días</option>
            <option value="30">30 días</option>
            <option value="60">60 días</option>
            <option value="90">90 días</option>
          </select>
        </div>

        {/* CATEGORÍA */}
        <div>
          <label className="block text-sm font-medium mb-1">Categoría</label>
          <select
            value={categoriaId}
            onChange={e => setCategoriaId(e.target.value)}
            className="p-2 border rounded-md w-full"
          >
            <option value="">Todas</option>
            {categorias.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>

        {/* PRODUCTO DEPENDIENTE */}
        <div>
          <label className="block text-sm font-medium mb-1">Producto</label>
          <select
            value={productoId}
            onChange={e => setProductoId(e.target.value)}
            className="p-2 border rounded-md w-full"
            disabled={!productos.length}
          >
            <option value="">Todos</option>
            {productos.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </div>

        {/* BOTÓN FILTRAR */}
        <div className="flex items-end">
          <button
            onClick={onFiltrar}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
}

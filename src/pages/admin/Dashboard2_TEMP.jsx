// src/pages/admin/Dashboard2_TEMP.jsx
import React, { useEffect, useState } from "react";
import api from "../../services/api.service";

import GraficoVentasHistoricas from "./graph/GraficoVentasHistoricas";
import GraficoVentasPorProducto from "./graph/GraficoVentasPorProducto";
import GraficoProductosBajaRotacion from "./graph/GraficoProductosBajaRotacion";

const Dashboard2Page = () => {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [productoId, setProductoId] = useState("");
  const [periodo, setPeriodo] = useState(90);

  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);

  const [kpis, setKpis] = useState(null);
  const [filtros, setFiltros] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ===================== KPIS =====================
  useEffect(() => {
    setLoading(true);
    api.get("/prediccion/kpis/")
      .then((res) => {
        setKpis(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error KPIs:", err);
        setError("Error al cargar los KPIs");
      })
      .finally(() => setLoading(false));
  }, []);

  // ===================== CATEGORÍAS =====================
  useEffect(() => {
    api.get("/categoria/")
      .then((res) => setCategorias(res.data || []))
      .catch((err) => console.error("Error categorías:", err));
  }, []);

  // ===================== PRODUCTOS DEPENDIENTES =====================
  useEffect(() => {
    const url = categoriaId
      ? `/producto/?categoria=${categoriaId}`
      : `/producto/`;

    api.get(url)
      .then((res) => {
        setProductos(res.data || []);
        // Reset producto si cambió categoría
        if (categoriaId) setProductoId("");
      })
      .catch((err) => console.error("Error productos:", err));
  }, [categoriaId]);

  // ===================== APLICAR FILTROS =====================
  const aplicarFiltros = () => {
    if (!fechaInicio || !fechaFin) {
      alert("⚠️ Seleccione un rango de fechas válido");
      return;
    }

    if (new Date(fechaInicio) > new Date(fechaFin)) {
      alert("⚠️ La fecha de inicio debe ser anterior a la fecha fin");
      return;
    }

    setFiltros({
      fechaInicio,
      fechaFin,
      categoriaId,
      productoId,
    });
  };

  // ===================== LIMPIAR FILTROS =====================
  const limpiarFiltros = () => {
    setFechaInicio("");
    setFechaFin("");
    setCategoriaId("");
    setProductoId("");
    setFiltros(null);
  };

  // ===================== ATAJOS DE FECHAS =====================
  const aplicarRangoRapido = (dias) => {
    const hoy = new Date();
    const inicio = new Date();
    inicio.setDate(hoy.getDate() - dias);

    setFechaInicio(inicio.toISOString().split('T')[0]);
    setFechaFin(hoy.toISOString().split('T')[0]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 space-y-6">

      {/* ===================== HEADER ===================== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">📊 Dashboard de Análisis</h1>
          <p className="text-gray-600 mt-1">Monitoreo de ventas y productos en tiempo real</p>
        </div>
        
        {filtros && (
          <button
            onClick={limpiarFiltros}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <span>🔄</span>
            Limpiar Filtros
          </button>
        )}
      </div>

      {/* ===================== KPIS ===================== */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-lg border animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      ) : kpis && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-indigo-100 text-sm font-medium">Ventas Totales Históricas</h3>
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-3xl font-bold">
              Bs {(kpis.total_historico_bs || 0).toLocaleString('es-BO')}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-green-100 text-sm font-medium">Ventas Hoy</h3>
              <span className="text-2xl">📈</span>
            </div>
            <p className="text-3xl font-bold">
              Bs {(kpis.total_hoy_bs || 0).toLocaleString('es-BO')}
            </p>
            <p className="text-green-100 text-xs mt-2">
              {new Date().toLocaleDateString('es-BO', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-blue-100 text-sm font-medium">Total Productos</h3>
              <span className="text-2xl">📦</span>
            </div>
            <p className="text-3xl font-bold">
              {kpis.total_productos || 0}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-purple-100 text-sm font-medium">Órdenes Totales</h3>
              <span className="text-2xl">🛒</span>
            </div>
            <p className="text-3xl font-bold">
              {kpis.total_ordenes || 0}
            </p>
          </div>
        </div>
      )}

      {/* ===================== FILTROS ===================== */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span>🔍</span>
            Filtros de Búsqueda
          </h2>
          
          {/* Atajos rápidos de fechas */}
          <div className="flex gap-2">
            <button
              onClick={() => aplicarRangoRapido(7)}
              className="px-3 py-1 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md transition-colors"
            >
              Últimos 7 días
            </button>
            <button
              onClick={() => aplicarRangoRapido(30)}
              className="px-3 py-1 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md transition-colors"
            >
              Últimos 30 días
            </button>
            <button
              onClick={() => aplicarRangoRapido(90)}
              className="px-3 py-1 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md transition-colors"
            >
              Últimos 90 días
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">📅 Desde</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">📅 Hasta</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">🏷️ Categoría</label>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className="p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="">Todas las categorías</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">📦 Producto</label>
            <select
              value={productoId}
              onChange={(e) => setProductoId(e.target.value)}
              className="p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              disabled={!productos.length}
            >
              <option value="">Todos los productos</option>
              {productos.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={aplicarFiltros}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-2.5 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>✓</span>
              Aplicar Filtros
            </button>
          </div>

        </div>

        {filtros && (
          <div className="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
            <p className="text-sm text-indigo-700 font-medium">
              🎯 Filtros activos: 
              <span className="ml-2">
                {fechaInicio} al {fechaFin}
                {categoriaId && ` • Categoría seleccionada`}
                {productoId && ` • Producto específico`}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* ===================== GRÁFICOS ===================== */}
      {filtros ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GraficoVentasHistoricas filtros={filtros} />
            <GraficoVentasPorProducto filtros={filtros} />
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <GraficoProductosBajaRotacion periodo={periodo} setPeriodo={setPeriodo} />
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-xl shadow-lg border-2 border-dashed border-gray-300 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Selecciona un rango de fechas
          </h3>
          <p className="text-gray-500">
            Aplica los filtros para visualizar los gráficos de análisis
          </p>
        </div>
      )}

    </div>
  );
};

export default Dashboard2Page;
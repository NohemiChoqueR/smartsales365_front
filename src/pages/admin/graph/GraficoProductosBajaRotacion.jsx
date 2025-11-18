// ============================================================================
// src/pages/admin/graph/GraficoProductosBajaRotacion.jsx
// NUEVA VERSIÓN: Tabla con ranking e indicadores visuales
// ============================================================================
import React, { useEffect, useState } from "react";
import api from "../../../services/api.service";

export default function GraficoProductosBajaRotacion({ periodo = 90 }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verTodos, setVerTodos] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);

    api.get(`/prediccion/baja-rotacion/?periodo=${periodo}`)
      .then((res) => {
        const productos = res.data || [];
        // Ordenar por menor cantidad vendida (peor rotación primero)
        productos.sort((a, b) => (a.total_vendido || 0) - (b.total_vendido || 0));
        setData(productos);
        setLoading(false);
      })
      .catch((err) => {
        console.error("ERROR ROTACION:", err);
        setError("Error al cargar productos de baja rotación");
        setLoading(false);
      });
  }, [periodo]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analizando rotación...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border border-red-200">
        <div className="text-center text-red-600">
          <span className="text-4xl mb-2 block">⚠️</span>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <p className="text-xl font-bold text-green-600 mb-2">¡Excelente!</p>
          <p className="text-gray-600">No hay productos de baja rotación</p>
          <p className="text-sm text-gray-500 mt-1">Todos los productos se están vendiendo bien</p>
        </div>
      </div>
    );
  }

  const dataDisplay = verTodos ? data : data.slice(0, 10);
  const totalBaja = data.reduce((sum, item) => sum + (item.total_vendido || 0), 0);
  const promedioVentas = (totalBaja / data.length).toFixed(1);

  // Función para determinar el color según la gravedad
  const getSeverityColor = (vendidas) => {
    if (vendidas === 0) return "bg-red-100 border-red-300 text-red-800";
    if (vendidas <= 2) return "bg-orange-100 border-orange-300 text-orange-800";
    if (vendidas <= 5) return "bg-yellow-100 border-yellow-300 text-yellow-800";
    return "bg-blue-100 border-blue-300 text-blue-800";
  };

  const getSeverityIcon = (vendidas) => {
    if (vendidas === 0) return "🔴";
    if (vendidas <= 2) return "🟠";
    if (vendidas <= 5) return "🟡";
    return "🔵";
  };

  const getSeverityLabel = (vendidas) => {
    if (vendidas === 0) return "Crítico";
    if (vendidas <= 2) return "Muy Bajo";
    if (vendidas <= 5) return "Bajo";
    return "Moderado";
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            Productos de Baja Rotación
          </h3>
          <p className="text-sm text-gray-600 mt-1">Últimos {periodo} días • Acción requerida</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Total Productos</p>
          <p className="text-2xl font-bold text-red-600">{data.length}</p>
          <p className="text-xs text-gray-500 mt-1">Promedio: {promedioVentas} ventas</p>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-red-50 p-3 rounded-lg border border-red-200">
          <p className="text-xs text-red-600 font-medium">Sin Ventas</p>
          <p className="text-xl font-bold text-red-700">
            {data.filter(p => p.total_vendido === 0).length}
          </p>
        </div>
        <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
          <p className="text-xs text-orange-600 font-medium">1-2 Ventas</p>
          <p className="text-xl font-bold text-orange-700">
            {data.filter(p => p.total_vendido > 0 && p.total_vendido <= 2).length}
          </p>
        </div>
        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <p className="text-xs text-yellow-600 font-medium">3-5 Ventas</p>
          <p className="text-xl font-bold text-yellow-700">
            {data.filter(p => p.total_vendido > 2 && p.total_vendido <= 5).length}
          </p>
        </div>
      </div>

      {/* Tabla de productos */}
      <div className="max-h-96 overflow-y-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">#</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Producto</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Vendidas</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {dataDisplay.map((producto, index) => {
              const vendidas = producto.total_vendido || 0;
              return (
                <tr 
                  key={index}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-600 font-medium">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">{producto.nombre}</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-lg font-bold text-gray-700">
                      {vendidas}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(vendidas)}`}>
                      {getSeverityIcon(vendidas)} {getSeverityLabel(vendidas)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Botón ver más/menos */}
      {data.length > 10 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setVerTodos(!verTodos)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
          >
            {verTodos ? `Mostrar menos ↑` : `Ver todos (${data.length - 10} más) ↓`}
          </button>
        </div>
      )}

      {/* Recomendaciones */}
      <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-red-50 rounded-lg border border-amber-200">
        <p className="text-sm font-semibold text-gray-800 mb-2">💡 Acciones Recomendadas:</p>
        <ul className="text-xs text-gray-700 space-y-1 ml-4 list-disc">
          <li><strong>Productos críticos (0 ventas):</strong> Evaluar descontinuación o cambio de estrategia</li>
          <li><strong>Productos muy bajos (1-2 ventas):</strong> Implementar promociones urgentes</li>
          <li><strong>Productos bajos (3-5 ventas):</strong> Considerar descuentos o paquetes combo</li>
        </ul>
      </div>
    </div>
  );
}
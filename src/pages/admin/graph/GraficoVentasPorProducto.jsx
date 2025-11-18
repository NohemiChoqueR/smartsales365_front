// ============================================================================
// src/pages/admin/graph/GraficoVentasPorProducto.jsx
// ============================================================================
import React, { useEffect, useState } from "react";
import api from "../../../services/api.service";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend, Cell
} from "recharts";

const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899", "#14b8a6", "#f97316", "#6366f1"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="text-sm font-semibold text-gray-700">{payload[0].payload.nombre}</p>
        <p className="text-sm text-green-600 font-bold">
          Vendidas: {payload[0].value.toLocaleString('es-BO')} unidades
        </p>
      </div>
    );
  }
  return null;
};

export default function GraficoVentasPorProducto({ filtros }) {
  const { fechaInicio, fechaFin, categoriaId, productoId } = filtros;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limite, setLimite] = useState(10);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
    });

    if (categoriaId) params.append("categoria", categoriaId);
    if (productoId) params.append("producto", productoId);

    api.get(`/detalles-venta/?${params.toString()}`)
      .then((res) => {
        const detalles = res.data || [];

        const mapa = {};
        detalles.forEach((d) => {
          mapa[d.producto_nombre] = (mapa[d.producto_nombre] || 0) + d.cantidad;
        });

        const result = Object.keys(mapa).map((key) => ({
          nombre: key,
          cantidad: mapa[key],
        }));

        result.sort((a, b) => b.cantidad - a.cantidad);

        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        console.error("ERROR PRODUCTOS:", err);
        setError("Error al cargar productos vendidos");
        setLoading(false);
      });
  }, [fechaInicio, fechaFin, categoriaId, productoId]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando productos...</p>
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
        <div className="text-center text-gray-500">
          <span className="text-5xl mb-3 block">📦</span>
          <p className="text-lg font-medium">No hay productos vendidos</p>
          <p className="text-sm mt-1">En el rango de fechas seleccionado</p>
        </div>
      </div>
    );
  }

  const dataDisplay = data.slice(0, limite);
  const totalVendido = dataDisplay.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            Productos Más Vendidos
          </h3>
          <p className="text-sm text-gray-600 mt-1">Top {limite} productos del periodo</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Total Top {limite}</p>
          <p className="text-xl font-bold text-green-600">{totalVendido.toLocaleString('es-BO')}</p>
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        {[5, 10, 15, 20].map((num) => (
          <button
            key={num}
            onClick={() => setLimite(num)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
              limite === num
                ? "bg-green-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Top {num}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dataDisplay}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="nombre" 
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fontSize: 11 }}
            stroke="#6b7280"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="cantidad" name="Cantidad Vendida" radius={[8, 8, 0, 0]}>
            {dataDisplay.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
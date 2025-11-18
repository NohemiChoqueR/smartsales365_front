// ============================================================================
// src/pages/admin/graph/GraficoVentasHistoricas.jsx
// ============================================================================
import React, { useEffect, useState } from "react";
import api from "../../../services/api.service";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="text-sm font-semibold text-gray-700">{payload[0].payload.periodo}</p>
        <p className="text-sm text-blue-600 font-bold">
          Vendido: {payload[0].value.toLocaleString('es-BO')} unidades
        </p>
      </div>
    );
  }
  return null;
};

export default function GraficoVentasHistoricas({ filtros }) {
  const { fechaInicio, fechaFin, categoriaId, productoId } = filtros;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
    });

    if (categoriaId) params.append("categoria", categoriaId);
    if (productoId) params.append("producto", productoId);

    api.get(`/prediccion/historial/?${params.toString()}`)
      .then((res) => {
        setData(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("ERROR HISTÓRICO:", err);
        setError("Error al cargar datos históricos");
        setLoading(false);
      });
  }, [fechaInicio, fechaFin, categoriaId, productoId]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos históricos...</p>
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
          <span className="text-5xl mb-3 block">📉</span>
          <p className="text-lg font-medium">No hay datos disponibles</p>
          <p className="text-sm mt-1">Intenta con otro rango de fechas</p>
        </div>
      </div>
    );
  }

  const totalVentas = data.reduce((sum, item) => sum + (item.total_vendido || 0), 0);
  const promedio = (totalVentas / data.length).toFixed(2);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">📈</span>
            Ventas Históricas
          </h3>
          <p className="text-sm text-gray-600 mt-1">Tendencia de ventas en el tiempo</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Total Periodo</p>
          <p className="text-xl font-bold text-indigo-600">{totalVentas.toLocaleString('es-BO')}</p>
          <p className="text-xs text-gray-500 mt-1">Promedio: {promedio}</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="periodo" 
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="total_vendido" 
            stroke="#3b82f6" 
            strokeWidth={3}
            dot={{ fill: "#3b82f6", r: 4 }}
            activeDot={{ r: 6 }}
            name="Unidades Vendidas"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}






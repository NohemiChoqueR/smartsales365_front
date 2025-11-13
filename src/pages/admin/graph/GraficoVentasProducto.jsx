import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// Asumo que esta ruta es correcta según tu último código
import { reporteService } from '../../../services/reporte.service.js';

/**
 * Componente de gráfico para Top 10 Productos (por Ingresos).
 * Recibe las fechas de inicio y fin como objetos Date.
 */
const GraficoVentasProducto = ({ fechaInicio, fechaFin }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!fechaInicio || !fechaFin) {
      setData([]);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // --- ¡CAMBIO 1: El Endpoint! ---
        const endpoint = 'reports/filtrado/ventas-por-producto/';
        
        const params = {
          fecha_inicio: fechaInicio.toISOString().split('T')[0], 
          fecha_fin: fechaFin.toISOString().split('T')[0],
        };

        const result = await reporteService.getDatosReporteJSON(endpoint, params);
        
        // Tu API devuelve: [ { name: "...", total: ..., cantidad: ... }, ... ]
        // (Limitado a 10 por tu backend, ¡perfecto para un gráfico!)
        setData(result);
        
      } catch (err) {
        setError(err.message || 'Error al cargar datos del gráfico');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fechaInicio, fechaFin]);

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg h-96 w-full">
      {/* --- ¡CAMBIO 2: El Título! --- */}
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Top 10 Productos (por Ingresos)</h2>
      
      {loading && (
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-500">Cargando datos del gráfico...</p>
        </div>
      )}
      
      {error && (
        <div className="flex justify-center items-center h-full">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {!loading && !error && data.length === 0 && (
         <div className="flex justify-center items-center h-full">
          <p className="text-gray-500">No se encontraron datos para este rango de fechas.</p>
        </div>
      )}

      {!loading && !error && data.length > 0 && (
        <ResponsiveContainer width="100%" height="90%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            {/* Hacemos la fuente del eje X más pequeña por si los nombres son largos */}
            <XAxis dataKey="name" fontSize={10} />
            <YAxis />
            <Tooltip />
            <Legend />
            {/* --- ¡CAMBIO 3: Los Colores! --- */}
            {/* Verde "llamativo" para Ingresos */}
            <Bar dataKey="total" fill="#10B981" name="Ingresos Totales" />
            {/* Azul "llamativo" para Cantidad */}
            <Bar dataKey="cantidad" fill="#3B82F6" name="Nro. de Unidades" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default GraficoVentasProducto;
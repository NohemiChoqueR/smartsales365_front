import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// 🔥 CORRECCIÓN: Se añadió la extensión .js al final de la ruta
import { reporteService } from '../../../services/reporte.service';

/**
 * Componente de gráfico para Ventas por Sucursal.
 * Recibe las fechas de inicio y fin como objetos Date.
 */
const GraficoVentasSucursal = ({ fechaInicio, fechaFin }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // No hacer nada si las fechas no están listas o son nulas
    if (!fechaInicio || !fechaFin) {
      setData([]); // Limpiamos los datos si no hay fechas
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const endpoint = 'reports/filtrado/ventas-por-sucursal/';
        
        // Preparamos los parámetros para la API (formato YYYY-MM-DD)
        const params = {
          fecha_inicio: fechaInicio.toISOString().split('T')[0], 
          fecha_fin: fechaFin.toISOString().split('T')[0],
        };

        // ¡Usamos la nueva función del servicio que pide JSON!
        const result = await reporteService.getDatosReporteJSON(endpoint, params);
        
        // Tu API devuelve: [ { name: "...", total: ..., cantidad: ... }, ... ]
        setData(result);
        
      } catch (err) {
        setError(err.message || 'Error al cargar datos del gráfico');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fechaInicio, fechaFin]); // Se vuelve a ejecutar CADA VEZ que las fechas cambian

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg h-96 w-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Ventas por Sucursal</h2>
      
      {/* Manejo de estados de Carga / Error / Vacío */}
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

      {/* El Gráfico (solo se muestra si hay datos) */}
      {!loading && !error && data.length > 0 && (
        <ResponsiveContainer width="100%" height="90%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {/* 'total' es la clave que definimos en Django */}
            <Bar dataKey="total" fill="#4F46E5" name="Ingresos Totales" />
            {/* 'cantidad' también viene en los datos, ¡la añadimos! */}
            <Bar dataKey="cantidad" fill="#3B82F6" name="Nro. de Ventas" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default GraficoVentasSucursal;
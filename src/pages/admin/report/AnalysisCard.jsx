import React, { useState } from 'react';
import { reporteService } from '../../../services/reporte.service';// Ajusta la ruta
import { format } from 'date-fns';
import { Lightbulb, Loader2 } from 'lucide-react';

const AnalysisCard = ({ fechaInicio, fechaFin }) => {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalysis = async () => {
    if (loading || !fechaInicio || !fechaFin) return;

    setLoading(true);
    setError(null);
    setAnalysis('');

    try {
      const params = {
        fecha_inicio: format(fechaInicio, 'yyyy-MM-dd'),
        fecha_fin: format(fechaFin, 'yyyy-MM-dd'),
      };
      
      // Llama al servicio de Análisis
      const result = await reporteService.obtenerAnalisisVentas(params);
      
      // --- ¡LA CORRECCIÓN ESTÁ AQUÍ! ---
      // Leemos 'analisis' (con 'i') del JSON que nos mandaste
      if (result.analisis) {
        setAnalysis(result.analisis);
      } else {
        setError("La respuesta de la IA no tuvo el formato esperado.");
      }

    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al obtener el análisis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-5 border border-gray-200">
      <div className="flex items-center space-x-3 mb-3">
        <Lightbulb size={20} className="text-yellow-500" />
        <h3 className="text-lg font-semibold text-gray-900">Analista de Ventas IA</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Obtén un resumen y recomendaciones sobre las ventas de productos en el rango de fechas seleccionado.
      </p>
      
      <button
        onClick={handleAnalysis}
        disabled={loading || !fechaInicio}
        className="w-full flex items-center justify-center p-2 text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          'Analizar Ventas de Productos'
        )}
      </button>

      {error && (
        <p className="text-xs text-red-600 mt-3">Error: {error}</p>
      )}

      {/* El campo de respuesta que "faltaba" */}
      {analysis && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-2">Resultados del Análisis:</h4>
          {/* whitespace-pre-wrap respeta los saltos de línea (\n) del texto de la IA */}
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{analysis}</p>
        </div>
      )}
    </div>
  );
};

export default AnalysisCard;
import React, { useState } from 'react';
import { reporteService } from '../../../services/reporte.service';// Ajusta la ruta
import { Brain, Loader2 } from 'lucide-react';

const NlpReportCard = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt || loading) return;

    setLoading(true);
    setError(null);

    try {
      // Llama al servicio de NLP
      await reporteService.generarReporteNLP(prompt);
      setPrompt(''); // Limpia el input al éxito
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al procesar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-5 border border-gray-200">
      <div className="flex items-center space-x-3 mb-3">
        <Brain size={20} className="text-indigo-600" />
        <h3 className="text-lg font-semibold text-gray-900">Generador con IA</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Escribe qué reporte necesitas. Ej: "Reporte de ventas por sucursal del último mes en excel"
      </p>
      
      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Tu solicitud..."
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm"
          rows={3}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !prompt}
          className="w-full flex items-center justify-center mt-3 p-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            'Generar Reporte'
          )}
        </button>
        {error && (
          <p className="text-xs text-red-600 mt-3">Error: {error}</p>
        )}
      </form>
    </div>
  );
};

export default NlpReportCard;
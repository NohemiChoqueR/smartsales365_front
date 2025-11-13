import React from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline'; // O cualquier ícono que te guste

export const PredictionResultDisplay = ({ 
  title,       // Ej: "Ventas estimadas (Próximos 30 días)"
  value,       // Ej: "1.250"
  unit,        // Ej: "Unidades" o "Bs."
  analysis,    // Ej: "Predicción de alta confianza."
  isLoading = false,
  error = null
}) => {
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center animate-pulse">
          <div className="h-10 bg-gray-200 rounded-md w-3/4 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded-md w-1/2 mx-auto"></div>
        </div>
      );
    }

    if (error) {
      return <p className="text-center text-red-600 font-medium">{error}</p>;
    }

    if (!value) {
      return <p className="text-center text-gray-500">Aún no hay predicciones. Presiona "Predecir" para comenzar.</p>;
    }

    return (
      <>
        <p className="text-gray-600 text-sm font-medium text-center">{title}</p>
        <div className="text-center my-2">
          <span className="text-5xl font-extrabold text-gray-900 tracking-tight">{value}</span>
          <span className="text-2xl font-semibold text-gray-600 ml-2">{unit}</span>
        </div>
        
        {analysis && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700">Análisis del Modelo</h4>
            <p className="text-sm text-gray-600">{analysis}</p>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="bg-slate-50 rounded-lg shadow-inner border border-gray-200 p-6 h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Resultado de la Predicción
      </h3>
      {renderContent()}
    </div>
  );
};
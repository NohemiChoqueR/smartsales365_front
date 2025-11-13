import React from 'react';

// Este componente es para mostrar el resultado de la predicción
export const PredictionCard = ({ 
  title,         // Ej: "Ventas (Próx. Mes)"
  value,         // Ej: 150
  subtitle,      // Ej: "Predicción para 'Lácteos'"
  icon: Icon,    // El componente de ícono (ej. ChartBarIcon)
  colorClass,    // Ej: "text-blue-500"
  isLoading = false
}) => {
  
  const valueText = isLoading ? '...' : (value ?? 'N/A');
  const subtitleText = isLoading ? 'Calculando...' : subtitle;

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 relative overflow-hidden">
      
      {/* Etiqueta de "Machine Learning" */}
      <div className="absolute top-0 right-0 bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-bl-lg tracking-wide">
        🧠 Modelo AI
      </div>

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-gray-500 tracking-tight uppercase">
            {title}
          </h3>
          
          {/* El valor de la predicción (¡GRANDE!) */}
          <p className={`text-5xl font-bold tracking-tighter ${colorClass} ${isLoading ? 'animate-pulse' : ''}`}>
            {valueText}
          </p>
          <p className="text-sm text-gray-700 font-medium truncate">
            {subtitleText}
          </p>
        </div>
        
        {/* Ícono */}
        {Icon && (
          <div className={`p-3 rounded-full bg-opacity-10 ${colorClass.replace('text-', 'bg-')}`}>
            <Icon className={`h-7 w-7 ${colorClass}`} />
          </div>
        )}
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import 'react-datepicker/dist/react-datepicker.css';
import { Brain } from 'lucide-react';

// Importamos los dos componentes de IA
// Asumo que están en un subdirectorio 'report'
import NlpReportCard from './report/NlpReportCard.jsx';
import AnalysisCard from './report/AnalysisCard.jsx';

registerLocale('es', es);

/**
 * Página dedicada a las herramientas de Inteligencia Artificial
 */
const AnalyticsPage = () => {
  // Estado centralizado para las fechas (solo para el Analista)
  const [fechaFin, setFechaFin] = useState(new Date());
  const [fechaInicio, setFechaInicio] = useState(() => {
    const start = new Date();
    start.setDate(start.getDate() - 30); // Default: últimos 30 días
    return start;
  });

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      <div className="flex items-center space-x-3 mb-8">
        <Brain size={32} className="text-indigo-600" />
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Inteligencia de Negocio (IA)
        </h1>
      </div>

      {/* --- Contenedor de las herramientas de IA --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        
        {/* --- 1. Analista de Ventas (Izquierda) --- */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Filtro de Fechas solo para esta tarjeta */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Rango de Fechas para Analista
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Desde
                </label>
                <DatePicker
                  selected={fechaInicio}
                  onChange={(date) => setFechaInicio(date)}
                  selectsStart
                  startDate={fechaInicio}
                  endDate={fechaFin}
                  locale="es"
                  dateFormat="dd/MM/yyyy"
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hasta
                </label>
                <DatePicker
                  selected={fechaFin}
                  onChange={(date) => setFechaFin(date)}
                  selectsEnd
                  startDate={fechaInicio}
                  endDate={fechaFin}
                  minDate={fechaInicio}
                  locale="es"
                  dateFormat="dd/MM/yyyy"
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </div>
          </div>
          
          {/* La tarjeta del Analista */}
          <AnalysisCard 
            fechaInicio={fechaInicio}
            fechaFin={fechaFin}
          />
        </div>

        {/* --- 2. Generador NLP (Derecha) --- */}
        <div className="lg:col-span-1">
          <NlpReportCard />
        </div>
        
      </div>
    </div>
  );
};

export default AnalyticsPage;
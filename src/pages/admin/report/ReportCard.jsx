import React, { useState } from 'react';
import { reporteService } from '../../../services/reporte.service';// Ajusta la ruta
import { format } from 'date-fns';
import { Download, Loader2, FileText, FileSpreadsheet, FileDigit } from 'lucide-react';

const ReportCard = ({ titulo, descripcion, icon: Icon, endpoint, filenamePrefix, fechaInicio, fechaFin }) => {
  // Estado de carga por formato ('pdf', 'excel', 'csv')
  const [loadingFormat, setLoadingFormat] = useState(null);
  const [error, setError] = useState(null);

  const handleDownload = async (formato) => {
    if (loadingFormat) return; // Evita doble clic

    setLoadingFormat(formato);
    setError(null);

    try {
      // Formateamos las fechas a YYYY-MM-DD
      const fecha_inicio_str = format(fechaInicio, 'yyyy-MM-dd');
      const fecha_fin_str = format(fechaFin, 'yyyy-MM-dd');

      const params = {
        fecha_inicio: fecha_inicio_str,
        fecha_fin: fecha_fin_str,
        formato: formato
      };

      const extension = formato === 'excel' ? 'xlsx' : formato;
      const filename = `${filenamePrefix}_${fecha_inicio_str}_${fecha_fin_str}.${extension}`;

      // Llamamos al servicio de descarga
      await reporteService.descargarReporteFiltrado(endpoint, params, filename);

    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al generar el reporte.');
    } finally {
      setLoadingFormat(null); // Resetea el estado de carga
    }
  };

  // Helper para el botón (para no repetir código)
  const BotonDescarga = ({ formato, icono: IconoBoton }) => {
    const isLoading = loadingFormat === formato;
    return (
      <button
        onClick={() => handleDownload(formato)}
        disabled={!!loadingFormat} // Deshabilita todos si uno está cargando
        className={`flex-1 flex items-center justify-center p-2 text-sm font-medium rounded-md transition-colors
          ${isLoading 
            ? 'bg-gray-200 text-gray-500 cursor-wait' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50'}
        `}
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <IconoBoton size={16} className="mr-1.5" />
        )}
        <span className="uppercase">{formato}</span>
      </button>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
      <div className="p-5">
        <div className="flex items-center space-x-3 mb-3">
          <Icon size={20} className="text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">{titulo}</h3>
        </div>
        <p className="text-sm text-gray-600 mb-5">
          {descripcion}
        </p>
        
        {/* Botones de Descarga */}
        <div className="flex items-center space-x-2">
          <BotonDescarga formato="pdf" icono={FileText} />
          <BotonDescarga formato="excel" icono={FileSpreadsheet} />
          <BotonDescarga formato="csv" icono={FileDigit} />
        </div>
        
        {/* Manejo de Error */}
        {error && (
          <p className="text-xs text-red-600 mt-3">Error: {error}</p>
        )}
      </div>
    </div>
  );
};

export default ReportCard;
import React, { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import 'react-datepicker/dist/react-datepicker.css';
import { Download, BarChart, Users, CreditCard, Brain } from 'lucide-react';

// Importamos los componentes "inteligentes" que crearemos a continuación
import ReportCard from './report/ReportCard';
import NlpReportCard from './report/NlpReportCard';
import AnalysisCard from './report/AnalysisCard';

registerLocale('es', es);

// Lista de todos tus reportes de descarga
const reportesClasicos = [
  {
    titulo: 'Ventas por Producto',
    descripcion: 'Reporte detallado de ingresos y unidades vendidas por cada producto.',
    endpoint: 'reports/filtrado/ventas-por-producto/',
    icon: BarChart,
    filenamePrefix: 'reporte_ventas_producto'
  },
  {
    titulo: 'Ventas por Sucursal',
    descripcion: 'Comparativa de ingresos y número de ventas entre sucursales.',
    endpoint: 'reports/filtrado/ventas-por-sucursal/',
    icon: Download, // Puedes cambiar el ícono
    filenamePrefix: 'reporte_ventas_sucursal'
  },
  {
    titulo: 'Ventas por Vendedor',
    descripcion: 'Rendimiento de cada vendedor, mostrando ventas e ingresos generados.',
    endpoint: 'reports/filtrado/ventas-por-vendedor/',
    icon: Users,
    filenamePrefix: 'reporte_ventas_vendedor'
  },
  {
    titulo: 'Ingresos por Método de Pago',
    descripcion: 'Desglose de los ingresos totales según el método de pago utilizado.',
    endpoint: 'reports/filtrado/ingresos-por-metodo-pago/',
    icon: CreditCard,
    filenamePrefix: 'reporte_metodo_pago'
  },
];

const ReportesPage = () => {
  // Estado centralizado para las fechas
  const [fechaFin, setFechaFin] = useState(new Date());
  const [fechaInicio, setFechaInicio] = useState(() => {
    const start = new Date();
    start.setDate(start.getDate() - 30); // Default: últimos 30 días
    return start;
  });

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-8">
        Centro de Reportes
      </h1>

      {/* --- 1. Filtro de Fechas Compartido --- */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          1. Selecciona el Rango de Fechas
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

      {/* --- 2. Reportes Clásicos (Descargables) --- */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          2. Generar Reportes Clásicos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reportesClasicos.map((reporte) => (
            <ReportCard
              key={reporte.endpoint}
              titulo={reporte.titulo}
              descripcion={reporte.descripcion}
              icon={reporte.icon}
              endpoint={reporte.endpoint}
              filenamePrefix={reporte.filenamePrefix}
              // Pasamos las fechas como props
              fechaInicio={fechaInicio}
              fechaFin={fechaFin}
            />
          ))}
        </div>
      </div>


    </div>
  );
};

export default ReportesPage;
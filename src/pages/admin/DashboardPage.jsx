import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth'; // Ya lo tenías
import DatePicker, { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es'; // Para poner el calendario en español
import 'react-datepicker/dist/react-datepicker.css'; // Estilos del calendario

// Importamos el primer "widget" de gráfico que creamos
import GraficoVentasSucursal from './graph/GraficoVentasSucursal';// Ajusta la ruta si es necesario

import GraficoVentasProducto from './graph/GraficoVentasProducto'; // <-- ¡NUEVO!

registerLocale('es', es);

/**
 * Página principal del Dashboard de Reportes.
 */
const DashboardPage = () => {
  const { user } = useAuth();

  // Estado de fechas (controla todos los gráficos)
  const [fechaFin, setFechaFin] = useState(new Date());
  const [fechaInicio, setFechaInicio] = useState(() => {
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return start;
  });

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      
      {/* --- 1. Cabecera y Bienvenida --- */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Dashboard
        </h1>
        {user && (
          <p className="text-lg text-gray-600 mt-1">
            Bienvenido de nuevo, {user.nombre}.
          </p>
        )}
      </div>

      {/* --- 2. Filtro de Fechas (El "Controlador") --- */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Seleccionar Rango de Fechas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Selector de Fecha de Inicio */}
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
          {/* Selector de Fecha de Fin */}
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

      {/* --- 3. Grid de Gráficos (Los "Widgets") --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        
        {/* --- Widget 1: Ventas por Sucursal --- */}
        <GraficoVentasSucursal 
          fechaInicio={fechaInicio}
          fechaFin={fechaFin}
        />

        {/* --- Widget 2: Ventas por Producto (¡YA NO ES PLACEHOLDER!) --- */}
        <GraficoVentasProducto
          fechaInicio={fechaInicio}
          fechaFin={fechaFin}
        />
        
        {/* ... Aquí irán los demás gráficos ... */}
      </div>

    </div>
  );
};

export default DashboardPage;
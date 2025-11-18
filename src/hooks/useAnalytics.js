// src/hooks/useAnalytics.js
import { useState } from "react";
import api from "../services/api.service";

export const useAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = async (callback) => {
    try {
      setLoading(true);
      setError(null);
      return await callback();
    } catch (err) {
      console.error("Analytics error:", err);
      setError(err?.response?.data || "Error inesperado");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,

    // 📈 KPIs principales
    getKpis: () =>
      run(async () => {
        const res = await api.get("/prediccion/kpis/");
        return res.data;
      }),

    // 🔢 Ventas históricas por periodo
    getHistorial: (fechaInicio, fechaFin) =>
      run(async () => {
        const res = await api.get("/prediccion/historial/", {
          params: {
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
          },
        });
        return res.data;
      }),

    // 📦 Productos más vendidos
    getVentasPorProducto: (fechaInicio, fechaFin) =>
      run(async () => {
        const res = await api.get("/reportes/productos-ventas/", {
          params: {
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
          },
        });
        return res.data;
      }),

    // 🏬 Ventas por sucursal
    getVentasPorSucursal: (fechaInicio, fechaFin) =>
      run(async () => {
        const res = await api.get("/reportes/ventas-sucursal/", {
          params: {
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
          },
        });
        return res.data;
      }),

    // 🟥 Productos de baja rotación
    getBajaRotacion: () =>
      run(async () => {
        const res = await api.get("/prediccion/baja-rotacion/");
        return res.data;
      }),

    // 🤖 Predicciones futuras
    getPredicciones: (dias = 30) =>
      run(async () => {
        const res = await api.get("/prediccion/predicciones/", {
          params: { dias },
        });
        return res.data;
      }),
  };
};

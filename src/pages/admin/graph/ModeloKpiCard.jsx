// src/pages/admin/graph/ModeloKpiCard.jsx
import React from "react";

export default function ModeloKpiCard({ metadata }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow border grid grid-cols-1 md:grid-cols-3 gap-6">

      <div>
        <h4 className="text-sm text-gray-500">Error del Modelo (RMSE)</h4>
        <p className="text-2xl font-bold text-indigo-600">
          ± {metadata.rmse} Bs
        </p>
      </div>

      <div>
        <h4 className="text-sm text-gray-500">Fecha de Entrenamiento</h4>
        <p className="text-lg font-semibold text-gray-700">
          {metadata.fecha_entrenamiento}
        </p>
      </div>

      <div>
        <h4 className="text-sm text-gray-500">Interpretación</h4>
        <p className="text-gray-700">
          {metadata.interpretacion}
        </p>
      </div>

    </div>
  );
}

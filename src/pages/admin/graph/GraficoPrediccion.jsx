// src/pages/admin/graph/GraficoPrediccion.jsx
import React from "react";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

export default function GraficoPrediccion({ data }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow border">
      <h3 className="text-lg font-semibold mb-3">📅 Predicción Diaria</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid stroke="#e5e7eb" />
          <XAxis dataKey="fecha" />
          <YAxis />
          <Tooltip />
          <Line 
            type="monotone"
            dataKey="prediccion_total_bs"
            stroke="#4f46e5"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

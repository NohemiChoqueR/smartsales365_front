// src/pages/admin/graph/GraficoTendencias.jsx
import React from "react";
import {
  BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

export default function GraficoTendencias({ data }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow border">
      <h3 className="text-lg font-semibold mb-3">🌍 Tendencias Globales</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid stroke="#e5e7eb" />
          <XAxis dataKey="fecha" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="prediccion_total_bs" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

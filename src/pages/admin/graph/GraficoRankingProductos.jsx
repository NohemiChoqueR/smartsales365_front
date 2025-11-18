// src/pages/admin/graph/GraficoRankingProductos.jsx
import React from "react";
import {
  BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

export default function GraficoRankingProductos({ data }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow border">
      <h3 className="text-lg font-semibold mb-3">🏆 Productos con Mayor Tendencia</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid stroke="#e5e7eb" />
          <XAxis dataKey="producto" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="fuerza" fill="#06b6d4" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useFetchDocuments } from "../../hooks/UseFetchDocuments";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export const EspecialidadePorMes = () => {
  const { documents } = useFetchDocuments("clientesCirurgia");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!documents) return;

    const data = {};

    documents.forEach((doc) => {
      if (doc.cirurgia) {
        const mes = new Date(doc.dataProcedimento).toLocaleString("default", { month: "short" });
        data[mes] = data[mes] || {};
        data[mes][doc.cirurgia] = (data[mes][doc.cirurgia] || 0) + 1;
      }
    });

    const formatted = Object.entries(data).flatMap(([mes, especialidades]) =>
      Object.entries(especialidades).map(([nome, count]) => ({
        mes,
        nome,
        count,
      }))
    );

    setChartData(formatted);
  }, [documents]);

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="nome"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#6EE7B7"
            label
          >
            {chartData.map((_, i) => (
              <Cell key={`cell-${i}`} fill={`hsl(${i * 50}, 70%, 50%)`} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
import React, { useEffect, useState } from "react";
import { useFetchDocuments } from "../../hooks/UseFetchDocuments";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

export const AnestesistasPorAno = () => {
  const { documents } = useFetchDocuments("clientesCirurgia");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!documents) return;

    const data = {};

    documents.forEach((doc) => {
      if (doc.AvaliacaoAnestesica && doc.medico) {
        const ano = new Date(doc.dataProcedimento).getFullYear();
        data[ano] = data[ano] || {};
        data[ano][doc.medico] = (data[ano][doc.medico] || 0) + 1;
      }
    });

    const formatted = Object.entries(data).flatMap(([ano, medicos]) =>
      Object.entries(medicos).map(([nome, count]) => ({
        ano,
        nome,
        count,
      }))
    );

    setChartData(formatted);
  }, [documents]);

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="nome" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#F59E0B" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
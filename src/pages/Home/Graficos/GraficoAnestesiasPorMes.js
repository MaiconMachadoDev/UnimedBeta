import React, { useEffect, useState } from "react";
import { useFetchDocuments } from "../../../hooks/UseFetchDocuments";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const AnestesiasPorMes = () => {
  const { documents } = useFetchDocuments("clientesCirurgia");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!documents) return;
    const monthCount = {};

    documents.forEach((doc) => {
      if (doc.AvaliacaoAnestesica) {
        const month = new Date(doc.dataProcedimento).toLocaleString("default", { month: "short" });
        monthCount[month] = (monthCount[month] || 0) + 1;
      }
    });

    const formatted = Object.entries(monthCount).map(([mes, count]) => ({
      mes,
      count,
    }));

    setChartData(formatted);
  }, [documents]);

  return (
    <div className="w-full h-72 bg-white">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="count" stroke="#3B82F6" fill="#BFDBFE" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnestesiasPorMes;

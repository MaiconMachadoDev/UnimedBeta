import { useEffect, useState } from "react";
import { useFetchDocuments } from "../../../hooks/UseFetchDocuments";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const CirurgiasPorAno = () => {
  const { documents } = useFetchDocuments("clientesCirurgia");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!documents) return;

    const yearCount = {};

    documents.forEach((doc) => {
      const year = new Date(doc.dataProcedimento).getFullYear();
      if (year) {
        yearCount[year] = (yearCount[year] || 0) + 1;
      }
    });

    const formatted = Object.entries(yearCount).map(([year, count]) => ({
      year,
      count,
    }));

    setChartData(formatted);
  }, [documents]);

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CirurgiasPorAno;

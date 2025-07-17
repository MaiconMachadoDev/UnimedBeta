import { useEffect, useState } from "react";
import { useFetchDocuments } from "../../../hooks/UseFetchDocuments";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#10B981",
  "#3B82F6",
  "#EF4444",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#D97706",
  "#6366F1",
  "#DB2777",
]; // cores para as barras

const CirurgiaoPorAno = () => {
  const { documents } = useFetchDocuments("clientesCirurgia");
  const [chartData, setChartData] = useState([]);
  const [medicos, setMedicos] = useState([]);

  useEffect(() => {
    if (!documents) return;

    const cirurgiaoPorAno = {};
    const medicosSet = new Set();

    documents.forEach((doc) => {
      const ano = new Date(doc.dataProcedimento).getFullYear();
      const medico = doc.medico || "Desconhecido";

      medicosSet.add(medico);

      if (!cirurgiaoPorAno[ano]) cirurgiaoPorAno[ano] = {};
      if (!cirurgiaoPorAno[ano][medico]) cirurgiaoPorAno[ano][medico] = 0;

      cirurgiaoPorAno[ano][medico]++;
    });

    const formatted = Object.entries(cirurgiaoPorAno).map(([ano, cirurgioes]) => ({
      ano,
      ...cirurgioes,
    }));

    setMedicos(Array.from(medicosSet));
    setChartData(formatted);
  }, [documents]);

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="ano" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          {medicos.map((medico, index) => (
            <Bar
              key={medico}
              dataKey={medico}
              fill={COLORS[index % COLORS.length]}
              name={medico}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CirurgiaoPorAno;

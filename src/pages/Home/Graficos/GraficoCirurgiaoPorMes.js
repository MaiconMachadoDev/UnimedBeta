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
  "#6366F1",
  "#10B981",
  "#3B82F6",
  "#EF4444",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#D97706",
  "#DB2777",
]; // cores para as barras

const CirurgiaoPorMes = () => {
  const { documents } = useFetchDocuments("clientesCirurgia");
  const [chartData, setChartData] = useState([]);
  const [medicos, setMedicos] = useState([]);

  useEffect(() => {
    if (!documents) return;

    const cirurgiaoPorMes = {};
    const medicosSet = new Set();

    documents.forEach((doc) => {
      if (!doc.dataProcedimento || !doc.medico) return;

      const data = new Date(doc.dataProcedimento);
      const mes = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`;
      const medico = doc.medico;

      medicosSet.add(medico);

      if (!cirurgiaoPorMes[mes]) cirurgiaoPorMes[mes] = {};
      if (!cirurgiaoPorMes[mes][medico]) cirurgiaoPorMes[mes][medico] = 0;

      cirurgiaoPorMes[mes][medico]++;
    });

    const formatted = Object.entries(cirurgiaoPorMes).map(([mes, cirurgioes]) => ({
      mes,
      ...cirurgioes,
    }));

    setMedicos(Array.from(medicosSet));
    setChartData(formatted);
  }, [documents]);

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="mes" />
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

export default CirurgiaoPorMes;

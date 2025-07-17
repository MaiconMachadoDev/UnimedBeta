import { useEffect, useState } from "react";
import { useFetchDocuments } from "../../hooks/UseFetchDocuments";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const CirurgiaoPorAno = () => {
  const { documents } = useFetchDocuments("clientesCirurgia");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!documents) return;

    const cirurgiaoPorAno = {};

    documents.forEach((doc) => {
      const ano = new Date(doc.dataProcedimento).getFullYear();
      const medico = doc.medico;

      if (!cirurgiaoPorAno[ano]) cirurgiaoPorAno[ano] = {};
      if (!cirurgiaoPorAno[ano][medico]) cirurgiaoPorAno[ano][medico] = 0;

      cirurgiaoPorAno[ano][medico]++;
    });

    const formatted = Object.entries(cirurgiaoPorAno).map(([ano, cirurgioes]) => ({
      ano,
      ...cirurgioes,
    }));

    setChartData(formatted);
  }, [documents]);

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="ano" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="marcio gimenes" fill="#10B981" />
          {/* Adicione mais <Bar dataKey="outro_cirurgiao" /> se necessário */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CirurgiaoPorAno;

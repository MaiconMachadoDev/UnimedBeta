import { useEffect, useState } from "react";
import { useFetchDocuments } from "../../hooks/UseFetchDocuments";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const CirurgiaoPorMes = () => {
  const { documents } = useFetchDocuments("clientesCirurgia");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!documents) return;

    const cirurgiaoPorMes = {};

    documents.forEach((doc) => {
      const data = new Date(doc.dataProcedimento);
      const mes = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`;
      const medico = doc.medico;

      if (!cirurgiaoPorMes[mes]) cirurgiaoPorMes[mes] = {};
      if (!cirurgiaoPorMes[mes][medico]) cirurgiaoPorMes[mes][medico] = 0;

      cirurgiaoPorMes[mes][medico]++;
    });

    const formatted = Object.entries(cirurgiaoPorMes).map(([mes, cirurgioes]) => ({
      mes,
      ...cirurgioes,
    }));

    setChartData(formatted);
  }, [documents]);

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="marcio gimenes" fill="#6366F1" />
          {/* Adicione mais <Bar dataKey="nome_do_cirurgiao" /> se quiser */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CirurgiaoPorMes;
import React, { useEffect, useState } from "react";
import { useFetchDocuments } from "../../../hooks/UseFetchDocuments";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const medicoParaEspecialidade = {
  "marcio gimenes": "Gastro",
  "dgoberto maia": "Gastro",
  "tabelli": "Plastica",
  "carlos rodrigo": "Ortopedia",
  "luiz gustavo": "Urologia",
  "fernando matos": "Cirurgia Geral",
  // adicione mais conforme necessário
};

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
];

const EspecialidadePorAno = () => {
  const { documents } = useFetchDocuments("clientesCirurgia");
  const [chartData, setChartData] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);

  useEffect(() => {
    if (!documents) return;

    const data = {};
    const especialidadesSet = new Set();

    documents.forEach((doc) => {
      if (!doc.dataProcedimento) return;

      const ano = new Date(doc.dataProcedimento).getFullYear();
      const medico = (doc.medico || "").toLowerCase().trim();
      const especialidade = medicoParaEspecialidade[medico] || "Desconhecida";

      especialidadesSet.add(especialidade);

      if (!data[ano]) data[ano] = {};
      if (!data[ano][especialidade]) data[ano][especialidade] = 0;

      data[ano][especialidade]++;
    });

    const formatted = Object.entries(data).map(([ano, especialidadesObj]) => ({
      ano,
      ...especialidadesObj,
    }));

    setEspecialidades(Array.from(especialidadesSet));
    setChartData(formatted);
  }, [documents]);

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="ano" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          {especialidades.map((esp, index) => (
            <Bar key={esp} dataKey={esp} fill={COLORS[index % COLORS.length]} name={esp} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EspecialidadePorAno;

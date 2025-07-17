import { useState, useEffect } from "react";
import { useFetchDocuments } from "../../../../hooks/UseFetchDocuments";
import { db } from "../../../../firebase/config"; 
import { collection, getDocs } from "firebase/firestore";

import GraficoEspecialidadePorAno from "../../Graficos/GraficoCirurgiaEspecialidadeAno";
import GraficoCirurgiasPorEspecialidadeMes from "../../Graficos/GraficoCirurgiaEspecialidadeMes";
import GraficoCirurgiaoPorMes from "../../Graficos/GraficoCirurgiaoPorMes";
import GraficoCirurgiaoPorAno from "../../Graficos/GraficoCirurgiaoPorAno";
import CardCirurgioes from "./CardCirurgioes";

// Chart.js
import {
  Chart as ChartJs,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJs.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement);

const GraficoCirurgioes = () => {
  const [cirurgiasPorMedico, setCirurgiasPorMedico] = useState({});
  const [query, setQuery] = useState("");
  const { documents, loading } = useFetchDocuments("clientesCirurgia", query);

  useEffect(() => {
    async function carregarDados() {
      const snapshot = await getDocs(collection(db, "clientesCirurgia"));
      const dados = snapshot.docs.map(doc => doc.data());

      const agrupado = {};

      dados.forEach(cirurgia => {
        const nomeMedico = cirurgia.medico;
        const dataStr = cirurgia.dataProcedimento;

        if (!nomeMedico || !dataStr) return;

        const data = new Date(dataStr);

        if (!agrupado[nomeMedico]) agrupado[nomeMedico] = [];
        agrupado[nomeMedico].push(data);
      });

      setCirurgiasPorMedico(agrupado);
    }

    carregarDados();
  }, []);

  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();

  const especialidade = {
    "marcio gimenes": "Gastro",
    "dgoberto maia": "Gastro",
    "tabelli": "Plástica",
    "carlos rodrigo": "Ortopedia",
    "luiz gustavo": "Urologia",
    "fernando matos": "Cirurgia Geral",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-7xl mx-auto px-4 py-8">
      {/* Gráfico 1 */}
      <div className="bg-white rounded-md shadow-md p-4">
        <h3 className="font-semibold text-green-700 mb-2">Cirurgias por Cirurgião (por Mês)</h3>
        {!loading && <GraficoCirurgiaoPorMes />}
      </div>

      {/* Gráfico 2 */}
      <div className="bg-white rounded-md shadow-md p-4">
        <h3 className="font-semibold text-green-700 mb-2">Cirurgias por Cirurgião (por Ano)</h3>
        {!loading && <GraficoCirurgiaoPorAno />}
      </div>

      {/* Gráfico 3 */}
      <div className="bg-white rounded-md shadow-md p-4">
        <h3 className="font-semibold text-green-700 mb-2">Cirurgias por Especialidade (por Mês)</h3>
        {!loading && <GraficoCirurgiasPorEspecialidadeMes />}
      </div>

      {/* Gráfico 4 */}
      <div className="bg-white rounded-md shadow-md p-4">
        <h3 className="font-semibold text-green-700 mb-2">Cirurgias por Especialidade (por Ano)</h3>
        {!loading && <GraficoEspecialidadePorAno />}
      </div>

      {/* Tabela de cirurgiões - ocupa toda a largura */}
      <div className="md:col-span-2 bg-white rounded-md shadow-md p-4 overflow-x-auto">
        <h3 className="font-semibold text-green-700 mb-4">Resumo de Cirurgias por Médico</h3>
        <table className="min-w-[640px] w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-300">
            <tr>
              <th className="px-4 py-3 text-gray-600 uppercase tracking-wide ">Nome</th>
              <th className="px-4 py-3 text-gray-600 uppercase tracking-wide">Especialidade</th>
              <th className="px-4 py-3 text-gray-600 uppercase tracking-wide text-center">Cirurgias Mês</th>
              <th className="px-4 py-3 text-gray-600 uppercase tracking-wide text-center">Cirurgias Ano</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(cirurgiasPorMedico).map(([nome, datas]) => {
              const cirurgiasMes = datas.filter(data => data.getMonth() === mesAtual && data.getFullYear() === anoAtual).length;
              const cirurgiasAno = datas.filter(data => data.getFullYear() === anoAtual).length;

              return (
                <CardCirurgioes
                  key={nome}
                  foto={`https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&background=random`}
                  nome={nome}
                  especialidade={especialidade[nome.toLowerCase()] || "Especialidade não definida"}
                  cirurgiasMes={cirurgiasMes}
                  cirurgiasAno={cirurgiasAno}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GraficoCirurgioes;

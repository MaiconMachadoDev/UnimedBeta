import { useState } from "react";
import { useFetchDocuments } from "../../../hooks/UseFetchDocuments";

// Gráficos

import GraficoEspecialidadePorAno from "../Graficos/GraficoCirurgiaEspecialidadeAno";
import GraficoCirurgiasPorEspecialidadeMes from "../Graficos/GraficoCirurgiaEspecialidadeMes";
import GraficoCirurgiaoPorMes from "../Graficos/GraficoCirurgiaoPorMes";
import GraficoCirurgiaoPorAno from "../Graficos/GraficoCirurgiaoPorAno";



// Chart.js
import {
  Chart as ChartJs,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

// Registrar elementos do Chart.js
ChartJs.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement);

const GraficoCirurgioes= () => {
  const [query, setQuery] = useState("");
  const { documents, loading } = useFetchDocuments("clientesCirurgia", query);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl mx-auto px-4 py-8">
      {/* Gráfico 3 */}
      <div className="bg-white rounded-md shadow-md p-4">
        <h3 className="font-semibold text-green-700 mb-2">Cirurgias por Cirurgião (por Mês)</h3>
        {!loading && <GraficoCirurgiaoPorMes />}
      </div>
      {/* Gráfico 4 */}
      <div className="bg-white rounded-md shadow-md p-4">
        <h3 className="font-semibold text-green-700 mb-2">Cirurgias por Cirurgião (por Ano)</h3>
        {!loading && <GraficoCirurgiaoPorAno />}
      </div>
      {/* Gráfico 5 */}
      <div className="bg-white rounded-md shadow-md p-4">
        <h3 className="font-semibold text-green-700 mb-2">Cirurgias por Especialidade (por Mês)</h3>
        {!loading && <GraficoCirurgiasPorEspecialidadeMes />}
      </div>
      {/* Gráfico 6 */}
      <div className="bg-white rounded-md shadow-md p-4">
        <h3 className="font-semibold text-green-700 mb-2">Cirurgias por Especialidade (por Ano)</h3>
        {!loading && <GraficoEspecialidadePorAno />}
      </div>
      
    </div>
  );
};

export default GraficoCirurgioes;

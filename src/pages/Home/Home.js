import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useFetchDocuments } from "../../hooks/UseFetchDocuments";
import { useAuthentication } from "../../hooks/useAuthentication";
import { onAuthStateChanged } from "firebase/auth";

// Ícones
import { FaUserDoctor } from "react-icons/fa6";
import { CiHospital1 } from "react-icons/ci";
import { GiDoctorFace } from "react-icons/gi";

// Componentes
import Cards from "./Cards/Cards";
import GraficoCirurgiasPorMes from "./Graficos/GraficoCirurgiasPorMes";
import GraficoCirurgiasPorAno from "./Graficos/GraficoCirurgiasPorAno";
import GraficoEspecialidadePorAno from "./Graficos/GraficoCirurgiaEspecialidadeAno";
import GraficoAnestesiasPorMes from "./Graficos/GraficoAnestesiasPorMes";
import GraficoAnestesistasPorAno from "./Graficos/GraficoAnestesistaPorAno";
import GraficoCirurgiasPorEspecialidadeMes from "./Graficos/GraficoCirurgiaEspecialidadeMes";
import GraficoCirurgiaoPorMes from "./Graficos/GraficoCirurgiaoPorMes";
import GraficoCirurgiaoPorAno from "./Graficos/GraficoCirurgiaoPorAno";

import {
  Chart as ChartJs,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
ChartJs.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement);

const Home = () => {
  const [query, setQuery] = useState("");
  const { documents: posts, loading } = useFetchDocuments("clientesCirurgia", query);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { auth } = useAuthentication();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query) {
      navigate(`/search?q=${query}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 px-4 py-10 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
        Bem-vindo ao Sistema de Gestão Cirúrgica
      </h1>

      {!user ? (
        <div className="text-center max-w-2xl">
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">Acesso Restrito</h2>
            <p className="text-gray-600 mb-6">
              Este sistema permite o gerenciamento completo do mapa cirúrgico do seu hospital,
              desde o agendamento de cirurgias até avaliações anestésicas.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/login"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="border border-green-600 text-green-600 hover:bg-green-50 font-semibold py-2 px-6 rounded-md"
              >
                Cadastre-se
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-green-700 mb-3">Gestão Cirúrgica</h3>
              <p className="text-gray-600">
                Gerencie todo o mapa cirúrgico do hospital, agenda de cirurgias e realize
                avaliações anestésicas de forma integrada.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-green-700 mb-3">Produtividade</h3>
              <p className="text-gray-600">
                Acesse gráficos e informações em tempo real sobre quantidade de cirurgias,
                tempo de uso de sala, desempenho de cirurgiões e muito mais.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Campo de busca */}
          <form
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 w-full max-w-md"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="Buscar por paciente, médico ou procedimento..."
              onChange={(e) => setQuery(e.target.value)}
              className="border text-xs border-green-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md">
              Pesquisar
            </button>
          </form>

          {/* Cards */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 w-full max-w-6xl mb-10">
            <Cards icon={<CiHospital1 />} title="Cirurgias Agendadas Totais" value="140" />
            <Cards icon={<GiDoctorFace />} title="Cirurgias por Cirurgião" value="95" />
            <Cards icon={<FaUserDoctor />} title="Cirurgias por Anestesista" value="87" />
            <Cards icon={<CiHospital1 />} title="Cirurgias Canceladas" value="10" />
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
            <div>
              <h3 className="font-semibold text-green-700 mb-2">Cirurgias Agendadas por Mês</h3>
              {!loading && <GraficoCirurgiasPorMes />}
            </div>
            <div>
              <h3 className="font-semibold text-green-700 mb-2">Cirurgias Agendadas por Ano</h3>
              {!loading && <GraficoCirurgiasPorAno />}
            </div>
            <div>
              <h3 className="font-semibold text-green-700 mb-2">Cirurgias por Cirurgião (por Mês)</h3>
              {!loading && <GraficoCirurgiaoPorMes />}
            </div>
            <div>
              <h3 className="font-semibold text-green-700 mb-2">Cirurgias por Cirurgião (por Ano)</h3>
              {!loading && <GraficoCirurgiaoPorAno />}
            </div>
            <div>
              <h3 className="font-semibold text-green-700 mb-2">Cirurgias por Especialidade (por Mês)</h3>
              {!loading && <GraficoCirurgiasPorEspecialidadeMes />}
            </div>
            <div>
              <h3 className="font-semibold text-green-700 mb-2">Cirurgias por Especialidade (por Ano)</h3>
              {!loading && <GraficoEspecialidadePorAno />}
            </div>
            <div>
              <h3 className="font-semibold text-green-700 mb-2">Anestesias Realizadas (por Mês)</h3>
              {!loading && <GraficoAnestesiasPorMes />}
            </div>
            <div>
              <h3 className="font-semibold text-green-700 mb-2">Anestesias por Anestesista (por Ano)</h3>
              {!loading && <GraficoAnestesistasPorAno />}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;

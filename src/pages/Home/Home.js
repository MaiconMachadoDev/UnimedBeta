import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useFetchDocuments } from "../../hooks/UseFetchDocuments";

const Home = () => {
  const [query, setQuery] = useState("");
  const { documents: posts, loading } = useFetchDocuments("clientesCirurgia", query);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query) {
      return navigate(`/search?q=${query}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 px-4 py-10 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
        Procedimentos Cirúrgicos Agendados
      </h1>

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
        <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md transition duration-300">
          Pesquisar
        </button>
      </form>

      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
        {loading && (
          <p className="text-green-700 text-center font-medium col-span-full">
            Carregando...
          </p>
        )}

        {!loading && posts && posts.length === 0 && (
          <div className="text-center text-gray-600 mt-8 col-span-full">
            <p className="mb-4">Nenhum procedimento encontrado.</p>
            <Link
              to="/posts/create"
              className="text-green-600 font-semibold hover:underline"
            >
              Criar novo agendamento
            </Link>
          </div>
        )}

        {!loading && posts && posts.length > 0 && (
          posts.map((clientesCirurgia) => (
          <div
            key={clientesCirurgia.id}
            className="flex flex-col text-center bg-white border border-green-200 rounded-2xl shadow-md p-3 transition hover:shadow-lg w-full sm:max-w-[375px] mx-auto space-y-1"
          >
            <h2 className="text-xl font-semibold text-green-700">
              {clientesCirurgia.cirurgia}
            </h2>
            <p className="text-gray-700 text-sm mb-0">
              <span className="font-semibold">Paciente:</span> {clientesCirurgia.nome}
            </p>
           <p className="text-gray-700 text-sm mb-0">
                <span className="font-semibold">Mãe:</span> {clientesCirurgia.mae}
              </p>
              <p className="text-gray-700 text-sm mb-0">
                <span className="font-semibold">Data Cirúrgica:</span> {clientesCirurgia.dataProcedimento}
              </p>
              <p className="text-gray-700 text-sm mb-0">
                <span className="font-semibold">Cirurgião:</span> {clientesCirurgia.medico}
              </p>
              <p className="text-gray-700 text-sm mb-0">
                <span className="font-semibold">Horário:</span> {clientesCirurgia.horarioCirurgia}
              </p>
            <p className="text-gray-700 text-sm mt-1 mb-0">
              Avaliado:{" "}
              <span
                className={`text-sm rounded-md text-white font-bold px-2 py-1 select-none ${
                  clientesCirurgia.AvaliacaoAnestesica ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {clientesCirurgia.AvaliacaoAnestesica ? "Sim" : "Não"}
              </span>
            </p>
            <div className="mr-3 flex place-items-center justify-end gap-4 mt-1">
              <Link
                to={`/paciente/${clientesCirurgia.id}`}
                className="text-green-700 font-semibold hover:underline text-sm"
              >
                Ver
              </Link>
            </div>
          </div>
        ))
        )}
      </div>
    </div>
  );
};

export default Home;
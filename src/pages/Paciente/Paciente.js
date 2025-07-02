import { useParams, useNavigate } from "react-router-dom";
import { useFetchDocument } from "../../hooks/useFetchDocument";
import { Link } from "react-router-dom";

const Paciente = () => {
  const { id } = useParams();
  const { document: post, loading } = useFetchDocument("clientesCirurgia", id);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="text-green-700 font-medium">Carregando...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="text-red-600 font-semibold">Procedimento não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 via-white to-green-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-2xl">
        <div className="mb-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-green-700 hover:text-green-900 text-sm font-semibold"
          >
            ← Voltar
          </Link>
        </div>
        <h2 className="text-2xl font-bold text-green-700 text-center mb-6">
          Detalhes do Procedimento Cirúrgico
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-green-900">
          <div>
            <strong>Nome do Cliente:</strong>
            <p className="bg-green-50 border border-green-200 rounded-md p-2">{post.nome}</p>
          </div>

          <div>
            <strong>Nome da Mãe:</strong>
            <p className="bg-green-50 border border-green-200 rounded-md p-2">{post.mae}</p>
          </div>

          <div>
            <strong>Data de Nascimento:</strong>
            <p className="bg-green-50 border border-green-200 rounded-md p-2">{post.nascimento}</p>
          </div>

          <div>
            <strong>Idade:</strong>
            <p className="bg-green-50 border border-green-200 rounded-md p-2">{post.idade}</p>
          </div>

          <div>
            <strong>Convênio:</strong>
            <p className="bg-green-50 border border-green-200 rounded-md p-2">{post.convenio}</p>
          </div>

          <div>
            <strong>Nome do Médico:</strong>
            <p className="bg-green-50 border border-green-200 rounded-md p-2">{post.medico}</p>
          </div>

          <div className="md:col-span-2">
            <strong>Nome da Cirurgia:</strong>
            <p className="bg-green-50 border border-green-200 rounded-md p-2">{post.cirurgia}</p>
          </div>
          <div className="md:col-span-2">
            <strong>Material Cirurgico:</strong>
            <p className="bg-green-50 border border-green-200 rounded-md p-2">{post.materialCirurgico}</p>
          </div>

          <div>
            <strong>Data do Procedimento:</strong>
            <p className="bg-green-50 border border-green-200 rounded-md p-2">{post.dataProcedimento}</p>
          </div>

          <div>
            <strong>Sala de Cirurgia:</strong>
            <p className="bg-green-50 border border-green-200 rounded-md p-2">{post.salaCirurgia}</p>
          </div>

          <div>
            <strong>Horário da Cirurgia:</strong>
            <p className="bg-green-50 border border-green-200 rounded-md p-2">{post.horarioCirurgia}</p>
          </div>

          <div>
            <strong>OPME?</strong>
            <p className="bg-green-50 border border-green-200 rounded-md p-2">{post.opme}</p>
          </div>

          {post.opme === "sim" && (
            <div className="md:col-span-2">
              <strong>Detalhes OPME:</strong>
              <p className="bg-green-50 border border-green-200 rounded-md p-2">{post.opmeDetalhe}</p>
            </div>
          )}

          <div>
            <strong>Scopia?</strong>
            <p className="bg-green-50 border border-green-200 rounded-md p-2">{post.scopia}</p>
          </div>

          <div>
            <strong>Armário de Vídeo?</strong>
            <p className="bg-green-50 border border-green-200 rounded-md p-2">{post.armarioVideo}</p>
          </div>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition duration-300"
        >
          Voltar
        </button>
      </div>
    </div>
  );
};

export default Paciente;

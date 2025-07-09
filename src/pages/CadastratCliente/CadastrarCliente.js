import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuthValue } from "../../context/AuthContext";
import { useFetchDocument } from "../../hooks/useFetchDocument";
import {useInsertDocument} from "../../hooks/useInsertDocument";

const CadastrarCliente = () => {
  const { id } = useParams();
  const { document: paciente } = useFetchDocument("clientesCirurgia", id);

  const [nome, setNome] = useState("");
  const [mae, setMae] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [idade, setIdade] = useState("");
  const [convenio, setConvenio] = useState("");
  const [medico, setMedico] = useState("");
  const [cirurgia, setCirurgia] = useState("");
  const [opme, setOpme] = useState("não");
  const [opmeDetalhe, setOpmeDetalhe] = useState("");
  const [scopia, setScopia] = useState("não");
  const [armarioVideo, setArmarioVideo] = useState("não");
  const [dataProcedimento, setDataProcedimento] = useState("");
  const [salaCirurgia, setSalaCirurgia] = useState("");
  const [materialCirurgico, setMaterialCirurgico] = useState(""); 
  const [horarioCirurgia, setHorarioCirurgia] = useState("");
  const [formError, setFormError] = useState("");

  const { user } = useAuthValue();
  const { insertDocument, response } = useInsertDocument("clientesCirurgia");
  const navigate = useNavigate();

 
  useEffect(() => {
    if (nascimento) {
      const birthDate = new Date(nascimento);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setIdade(age);
    }
  }, [nascimento]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    if (
      !nome ||
      !mae ||
      !nascimento ||
      !convenio ||
      !medico ||
      !cirurgia ||
      !dataProcedimento ||
      !salaCirurgia ||
      !horarioCirurgia ||
      (opme === "sim" && !opmeDetalhe)
    ) {
      setFormError("Preencha todos os campos obrigatórios.");
      return;
    }

    insertDocument({
      nome,
      mae,
      nascimento,
      idade,
      convenio,
      medico,
      cirurgia,
      dataProcedimento,
      materialCirurgico,
      salaCirurgia,
      horarioCirurgia,
      opme,
      opmeDetalhe: opme === "sim" ? opmeDetalhe : "",
      scopia,
      armarioVideo,
      uid: user.uid,
      createdBy: user.displayName,
      AvaliacaoAnestesica: false,
    });

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 via-white to-green-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-2xl">
        <div className="mb-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-green-700 hover:text-green-900 text-sm font-semibold"
          >
            ← Voltar
          </Link>
        </div>
        <h2 className="text-2xl font-bold text-green-700 text-center mb-4">
          Cadastrar Cliente
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="text-sm text-green-800 mb-1">Nome do Cliente:</span>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: João da Silva"
              required
              className="px-3 py-2 bg-green-50 border border-green-200 rounded-md"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-green-800 mb-1">Nome da Mãe:</span>
            <input
              placeholder="Ex: Maria da Silva"
              type="text"
              value={mae}
              onChange={(e) => setMae(e.target.value)}
              required
              className="px-3 py-2 bg-green-50 border border-green-200 rounded-md"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-green-800 mb-1">Data de Nascimento:</span>
            <input
              type="date"
              value={nascimento}
              onChange={(e) => setNascimento(e.target.value)}
              required
              className="px-3 py-2 bg-green-50 border border-green-200 rounded-md"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-green-800 mb-1">Idade:</span>
            <input
              type="text"
              value={idade}
              disabled
              placeholder="Idade calculada automaticamente"
              className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-green-800 mb-1">Convênio:</span>
            <input
              type="text"
              value={convenio}
              onChange={(e) => setConvenio(e.target.value)}
              required
              placeholder="Ex: Unimed, Bradesco Saúde, etc."
              className="px-3 py-2 bg-green-50 border border-green-200 rounded-md"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-green-800 mb-1">Nome do Médico:</span>
            <input
            placeholder="Ex: Dr. Carlos Pereira"
              type="text"
              value={medico}
              onChange={(e) => setMedico(e.target.value)}
              required
              className="px-3 py-2 bg-green-50 border border-green-200 rounded-md"
            />
          </label>

          <label className="flex flex-col md:col-span-2">
            <span className="text-sm text-green-800 mb-1">Nome da Cirurgia:</span>
            <input
              type="text"
              placeholder="Ex: Colecistectomia, Apendicectomia, etc."
              value={cirurgia}
              onChange={(e) => setCirurgia(e.target.value)}
              required
              className="px-3 py-2 bg-green-50 border border-green-200 rounded-md"
            />
          </label>
           <label className="flex flex-col md:col-span-2">
            <span className="text-sm text-green-800 mb-1">Material Cirúrgico:</span>
            <input
              type="text"
              value={materialCirurgico}
              onChange={(e) => setMaterialCirurgico(e.target.value)}
              placeholder="Ex: Fio de sutura, grampeador, etc."
              className="px-3 py-2 bg-green-50 border border-green-200 rounded-md"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-green-800 mb-1">Data do Procedimento:</span>
            <input
              type="date"
              value={dataProcedimento}
              onChange={(e) => setDataProcedimento(e.target.value)}
              required
              className="px-3 py-2 bg-green-50 border border-green-200 rounded-md"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-green-800 mb-1">Sala de Cirurgia:</span>
            <select
              value={salaCirurgia}
              onChange={(e) => setSalaCirurgia(e.target.value)}
              required
              className="px-3 py-2 bg-white border border-green-200 rounded-md"
            >
              <option value="">Selecione</option>
              <option value="Sala 01">Sala 01</option>
              <option value="Sala 02">Sala 02</option>
              <option value="Sala 03">Sala 03</option>
              <option value="CO3">CO3</option>
            </select>
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-green-800 mb-1">Horário da Cirurgia:</span>
            <input
              type="time"
              value={horarioCirurgia}
              onChange={(e) => setHorarioCirurgia(e.target.value)}
              required
              className="px-3 py-2 bg-green-50 border border-green-200 rounded-md"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-green-800 mb-1">OPME?</span>
            <select
              value={opme}
              onChange={(e) => setOpme(e.target.value)}
              className="px-3 py-2 bg-white border border-green-200 rounded-md"
            >
              <option value="não">Não</option>
              <option value="sim">Sim</option>
            </select>
          </label>

          {opme === "sim" && (
            <label className="flex flex-col">
              <span className="text-sm text-green-800 mb-1">Qual OPME?</span>
              <input
                type="text"
                value={opmeDetalhe}
                onChange={(e) => setOpmeDetalhe(e.target.value)}
                placeholder="Ex: tipo de órtese"
                className="px-3 py-2 bg-green-50 border border-green-200 rounded-md"
              />
            </label>
          )}

          <label className="flex flex-col">
            <span className="text-sm text-green-800 mb-1">Scopia?</span>
            <select
              value={scopia}
              onChange={(e) => setScopia(e.target.value)}
              className="px-3 py-2 bg-white border border-green-200 rounded-md"
            >
              <option value="não">Não</option>
              <option value="sim">Sim</option>
            </select>
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-green-800 mb-1">Armário de Vídeo?</span>
            <select
              value={armarioVideo}
              onChange={(e) => setArmarioVideo(e.target.value)}
              className="px-3 py-2 bg-white border border-green-200 rounded-md"
            >
              <option value="não">Não</option>
              <option value="sim">Sim</option>
            </select>
          </label>

          <button
            type="submit"
            disabled={response.loading}
            className="md:col-span-2 mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition duration-300"
          >
            {response.loading ? "Cadastrando..." : "Cadastrar Cliente"}
          </button>

          {formError && (
            <p className="md:col-span-2 text-red-600 bg-red-100 border border-red-300 rounded-md px-4 py-2 text-sm mt-2 text-center">
              {formError}
            </p>
          )}

          {response.error && (
            <p className="md:col-span-2 text-red-600 bg-red-100 border border-red-300 rounded-md px-4 py-2 text-sm mt-2 text-center">
              {response.error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default CadastrarCliente;

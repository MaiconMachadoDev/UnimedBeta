import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuthValue } from "../../context/AuthContext";
import { useFetchDocument } from "../../hooks/useFetchDocument";
import {useInsertDocument} from "../../hooks/useInsertDocument";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config"; // ajuste o caminho se necessário
import SpinnerUnimed from "../../components/SpinnerUnimed";

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
  const [tempoCirurgia, setTempoCirurgia] = useState(""); // Novo estado
  const [formError, setFormError] = useState("");
  const [scopiaOverride, setScopiaOverride] = useState(false);
  const [scopiaConflict, setScopiaConflict] = useState(null);
  const [armarioVideoOverride, setArmarioVideoOverride] = useState(false);
  const [armarioVideoConflict, setArmarioVideoConflict] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setScopiaConflict(null);
    setArmarioVideoConflict(null);

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
      !tempoCirurgia || // Adicione a validação
      (opme === "sim" && !opmeDetalhe)
    ) {
      setFormError("Preencha todos os campos obrigatórios.");
      return;
    }

    // Busca todos os agendamentos do mesmo dia
    const q = query(
      collection(db, "clientesCirurgia"),
      where("dataProcedimento", "==", dataProcedimento)
    );
    const querySnapshot = await getDocs(q);

    // Função para converter "HH:mm" para minutos
    const horaParaMinutos = (hora) => {
      if (!hora) return null;
      const [h, m] = hora.split(":").map(Number);
      return h * 60 + m;
    };
    const minutosParaHora = (min) => {
      const h = String(Math.floor(min / 60)).padStart(2, "0");
      const m = String(min % 60).padStart(2, "0");
      return `${h}:${m}`;
    };

    const horarioNovoInicio = horaParaMinutos(horarioCirurgia);
    const tempoNovo = Number(tempoCirurgia);
    const horarioNovoFim = horarioNovoInicio + tempoNovo;

    let salaOcupada = false;
    let scopiaEmUso = null;
    let armarioVideoCount = 0;
    let armarioVideoHorarios = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const horarioExistenteInicio = horaParaMinutos(data.horarioCirurgia);
      const tempoExistente = Number(data.tempoCirurgia) || 0;
      const horarioExistenteFim = horarioExistenteInicio + tempoExistente;

      // Checa sala ocupada MESMO HORÁRIO E SALA
      if (
        data.salaCirurgia === salaCirurgia &&
        data.horarioCirurgia === horarioCirurgia
      ) {
        salaOcupada = true;
      }

      // Checa scopia em uso na janela de 2h
      if (
        scopia === "sim" &&
        data.scopia === "sim" &&
        horarioExistenteInicio !== null &&
        tempoExistente > 0 &&
        // verifica se há sobreposição de intervalos
        horarioNovoInicio < horarioExistenteFim &&
        horarioNovoFim > horarioExistenteInicio
      ) {
        scopiaEmUso = `${minutosParaHora(horarioExistenteInicio)} às ${minutosParaHora(horarioExistenteFim)}`;
      }

      // Conta armário de vídeo em uso na janela sobreposta
      if (
        armarioVideo === "sim" &&
        data.armarioVideo === "sim" &&
        horarioExistenteInicio !== null &&
        tempoExistente > 0 &&
        horarioNovoInicio < horarioExistenteFim &&
        horarioNovoFim > horarioExistenteInicio
      ) {
        armarioVideoCount++;
        armarioVideoHorarios.push(`${minutosParaHora(horarioExistenteInicio)} às ${minutosParaHora(horarioExistenteFim)}`);
      }
    });

    if (salaOcupada) {
      setFormError("Sala indisponível nesse horário.");
      return;
    }
    if (scopiaEmUso) {
      setScopiaConflict(scopiaEmUso);
      setFormError(`Scopia já em uso das ${scopiaEmUso}.`);
      if (!scopiaOverride) {
        return;
      }
    }
    if (armarioVideoCount >= 2) {
      setArmarioVideoConflict(armarioVideoHorarios.join(", "));
      setFormError(
        `Já existem 2 armários de vídeo em uso nesses horários: ${armarioVideoHorarios.join(", ")}.`
      );
      if (!armarioVideoOverride) {
        return;
      }
    }

    // Se passou nas validações, cadastra normalmente
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
      tempoCirurgia, // Adicione aqui
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
            <span className="text-sm text-green-800 mb-1">Tempo de Cirurgia (minutos):</span>
            <input
              type="number"
              min="1"
              value={tempoCirurgia}
              onChange={(e) => setTempoCirurgia(e.target.value)}
              required
              placeholder="Ex: 90"
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
          <div className="md:col-span-2 flex justify-center mt-4">
              <button
            type="submit"
            disabled={response.loading}
            className=" w-40 md:col-span-2 mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition duration-300"
          >
            {response.loading ? "Cadastrando..." : "Cadastrar Cliente"}
          </button>
          </div>
          
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

          {scopiaConflict && (
            <div className="md:col-span-2 flex items-center gap-2 bg-yellow-50 border border-yellow-300 rounded-md px-4 py-2 mt-2">
              <input
                type="checkbox"
                id="scopiaOverride"
                checked={scopiaOverride}
                onChange={(e) => setScopiaOverride(e.target.checked)}
                className="accent-yellow-500"
              />
              <label htmlFor="scopiaOverride" className="text-yellow-800 text-sm">
                Marcar mesmo assim (há scopia já agendada às {scopiaConflict})
              </label>
            </div>
          )}

          {armarioVideoConflict && (
            <div className="md:col-span-2 flex items-center gap-2 bg-yellow-50 border border-yellow-300 rounded-md px-4 py-2 mt-2">
              <input
                type="checkbox"
                id="armarioVideoOverride"
                checked={armarioVideoOverride}
                onChange={(e) => setArmarioVideoOverride(e.target.checked)}
                className="accent-yellow-500"
              />
              <label htmlFor="armarioVideoOverride" className="text-yellow-800 text-sm">
                Marcar mesmo assim (já existem 2 armários de vídeo em uso às {armarioVideoConflict})
              </label>
            </div>
          )}

        </form>
        {response.loading && <SpinnerUnimed />}
      </div>
    </div>
  );
};

export default CadastrarCliente;

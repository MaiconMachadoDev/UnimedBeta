import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuthValue } from "../../context/AuthContext";
import { useFetchDocument } from "../../hooks/useFetchDocument";
import { useUpdateDocument } from "../../hooks/useUpdateDocument";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";

const EditPaciente = () => {
  const { id } = useParams();
  const { document: paciente } = useFetchDocument("clientesCirurgia", id);
  const { updateDocument, response } = useUpdateDocument("clientesCirurgia");
  const { user } = useAuthValue();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [mae, setMae] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [idade, setIdade] = useState("");
  const [convenio, setConvenio] = useState("");
  const [medico, setMedico] = useState("");
  const [cirurgia, setCirurgia] = useState("");
  const [dataProcedimento, setDataProcedimento] = useState("");
  const [salaCirurgia, setSalaCirurgia] = useState("");
  const [horarioCirurgia, setHorarioCirurgia] = useState("");
  const [tempoCirurgia, setTempoCirurgia] = useState("");
  const [opme, setOpme] = useState("não");
  const [opmeDetalhe, setOpmeDetalhe] = useState("");
  const [scopia, setScopia] = useState("não");
  const [armarioVideo, setArmarioVideo] = useState("não");
  const [formError, setFormError] = useState("");
  const [materialCirurgico, setMaterialCirurgico] = useState("");
  const [scopiaConflict, setScopiaConflict] = useState(null);
  const [scopiaOverride, setScopiaOverride] = useState(false);
  const [armarioVideoConflict, setArmarioVideoConflict] = useState(null);
  const [armarioVideoOverride, setArmarioVideoOverride] = useState(false);

  useEffect(() => {
    if (paciente) {
      setNome(paciente.nome || "");
      setMae(paciente.mae || "");
      setNascimento(paciente.nascimento || "");
      setConvenio(paciente.convenio || "");
      setMedico(paciente.medico || "");
      setCirurgia(paciente.cirurgia || "");
      setDataProcedimento(paciente.dataProcedimento || "");
      setSalaCirurgia(paciente.salaCirurgia || "");
      setHorarioCirurgia(paciente.horarioCirurgia || "");
      setTempoCirurgia(paciente.tempoCirurgia?.toString() || "");
      setOpme(paciente.opme || "não");
      setOpmeDetalhe(paciente.opmeDetalhe || "");
      setScopia(paciente.scopia || "não");
      setArmarioVideo(paciente.armarioVideo || "não");
      setIdade(paciente.idade?.toString() || "");
      setMaterialCirurgico(paciente.materialCirurgico || "");
    }
  }, [paciente]);

  useEffect(() => {
    if (nascimento) {
      const birth = new Date(nascimento);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      setIdade(age.toString());
    }
  }, [nascimento]);

  // Funções auxiliares
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setScopiaConflict(null);
    setScopiaOverride(false);
    setArmarioVideoConflict(null);
    setArmarioVideoOverride(false);

    if (
      !nome || !mae || !nascimento || !convenio || !medico || !cirurgia ||
      !dataProcedimento || !salaCirurgia || !horarioCirurgia || !tempoCirurgia ||
      (opme === "sim" && !opmeDetalhe)
    ) {
      setFormError("Preencha todos os campos obrigatórios.");
      return;
    }

    // --- Validação de conflito de scopia e armário de vídeo ---
    const q = query(
      collection(db, "clientesCirurgia"),
      where("dataProcedimento", "==", dataProcedimento)
    );
    const querySnapshot = await getDocs(q);

    const horarioNovoInicio = horaParaMinutos(horarioCirurgia);
    const tempoNovo = Number(tempoCirurgia);
    const horarioNovoFim = horarioNovoInicio + tempoNovo;

    let scopiaEmUso = null;
    let armarioVideoCount = 0;
    let armarioVideoHorarios = [];

    querySnapshot.forEach((doc) => {
      if (doc.id === id) return; // Ignora o próprio paciente

      const data = doc.data();
      const horarioExistenteInicio = horaParaMinutos(data.horarioCirurgia);
      const tempoExistente = Number(data.tempoCirurgia) || 0;
      const horarioExistenteFim = horarioExistenteInicio + tempoExistente;

      // Checa sobreposição de scopia
      if (
        scopia === "sim" &&
        data.scopia === "sim" &&
        horarioExistenteInicio !== null &&
        tempoExistente > 0 &&
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

    if (scopiaEmUso && !scopiaOverride) {
      setScopiaConflict(scopiaEmUso);
      setFormError(`Scopia já em uso das ${scopiaEmUso}.`);
      return;
    }
    if (armarioVideoCount >= 2 && !armarioVideoOverride) {
      setArmarioVideoConflict(armarioVideoHorarios.join(", "));
      setFormError(
        `Já existem 2 armários de vídeo em uso nesses horários: ${armarioVideoHorarios.join(", ")}.`
      );
      return;
    }

    // --- Atualiza paciente ---
    updateDocument(id, {
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
      tempoCirurgia,
      opme,
      opmeDetalhe: opme === "sim" ? opmeDetalhe : "",
      scopia,
      armarioVideo,
      uid: user.uid,
      createdBy: user.displayName,
    });

    navigate("/dashboard");
  };

  // O botão só fica habilitado se não houver conflito ou se o override estiver marcado
  const isSubmitDisabled =
    response.loading ||
    (scopiaConflict && !scopiaOverride) ||
    (armarioVideoConflict && !armarioVideoOverride);

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
          Editar Cliente Cirúrgico
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="text-sm text-green-800 mb-1">Nome do Cliente:</span>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="px-3 py-2 bg-green-50 border border-green-200 rounded-md"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm text-green-800 mb-1">Nome da Mãe:</span>
            <input
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
              className="px-3 py-2 bg-gray-100 cursor-not-allowed border border-gray-300 rounded-md"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm text-green-800 mb-1">Convênio:</span>
            <input
              type="text"
              value={convenio}
              onChange={(e) => setConvenio(e.target.value)}
              required
              className="px-3 py-2 bg-green-50 border border-green-200 rounded-md"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm text-green-800 mb-1">Nome do Médico:</span>
            <input
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
              required
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
            <span className="text-sm text-green-800 mb-1">Horário da Cirurgia:</span>
            <input
              type="time"
              value={horarioCirurgia}
              onChange={(e) => setHorarioCirurgia(e.target.value)}
              required
              className="px-3 py-2 bg-green-50 border border-green-200 rounded-md"
            />
          </label>
          <label className="flex flex-col md:col-span-2">
            <span className="text-sm text-green-800 mb-1">Tempo de Cirurgia (minutos):</span>
            <input
              type="number"
              min="1"
              value={tempoCirurgia}
              onChange={(e) => setTempoCirurgia(e.target.value)}
              required
              className="px-3 py-2 bg-green-50 border border-green-200 rounded-md"
              placeholder="Ex: 90"
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
            <label className="flex flex-col md:col-span-2">
              <span className="text-sm text-green-800 mb-1">Qual OPME?</span>
              <input
                type="text"
                value={opmeDetalhe}
                onChange={(e) => setOpmeDetalhe(e.target.value)}
                className="px-3 py-2 bg-green-50 border border-green-200 rounded-md"
                placeholder="Ex: tipo de órtese"
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

          {/* Checkbox para scopia */}
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
                Marcar mesmo assim (há scopia já agendada das {scopiaConflict})
              </label>
            </div>
          )}

          {/* Checkbox para armário de vídeo */}
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
                Marcar mesmo assim (já existem 2 armários de vídeo em uso: {armarioVideoConflict})
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="md:col-span-2 mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition duration-300"
          >
            {response.loading ? "Atualizando..." : "Atualizar Cliente"}
          </button>

          {(formError || response.error) && (
            <p className="md:col-span-2 text-red-600 bg-red-100 border border-red-300 rounded-md px-4 py-2 text-sm mt-2 text-center">
              {formError || response.error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditPaciente;

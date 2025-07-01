import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuthValue } from "../../context/AuthContext";
import { useFetchDocument } from "../../hooks/useFetchDocument";
import { useUpdateDocument } from "../../hooks/useUpdateDocument";

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
  const [opme, setOpme] = useState("não");
  const [opmeDetalhe, setOpmeDetalhe] = useState("");
  const [scopia, setScopia] = useState("não");
  const [armarioVideo, setArmarioVideo] = useState("não");
  const [formError, setFormError] = useState("");
  const [materialCirurgico, setMaterialCirurgico] = useState(""); 

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    if (
      !nome || !mae || !nascimento || !convenio || !medico || !cirurgia ||
      !dataProcedimento || !salaCirurgia || !horarioCirurgia ||
      (opme === "sim" && !opmeDetalhe)
    ) {
      setFormError("Preencha todos os campos obrigatórios.");
      return;
    }

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
      opme,
      opmeDetalhe: opme === "sim" ? opmeDetalhe : "",
      scopia,
      armarioVideo,
      uid: user.uid,
      createdBy: user.displayName,
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
          Editar Cliente Cirúrgico
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mesmos campos, só com classes ajustadas */}
          {[
            { label: "Nome do Cliente", value: nome, set: setNome },
            { label: "Nome da Mãe", value: mae, set: setMae },
            { label: "Data de Nascimento", value: nascimento, set: setNascimento, type: "date" },
            { label: "Idade", value: idade, disabled: true },
            { label: "Convênio", value: convenio, set: setConvenio },
            { label: "Nome do Médico", value: medico, set: setMedico },
            { label: "Nome da Cirurgia", value: cirurgia, set: setCirurgia, span: 2 },
            { label: "Material Cirúrgico", value: materialCirurgico, set: setMaterialCirurgico, span: 2 },
            { label: "Data do Procedimento", value: dataProcedimento, set: setDataProcedimento, type: "date" },
            { label: "Horário da Cirurgia", value: horarioCirurgia, set: setHorarioCirurgia, type: "time" },
          ].map(({ label, value, set, type = "text", disabled = false, span }) => (
            <label
              key={label}
              className={`flex flex-col ${span === 2 ? "md:col-span-2" : ""}`}
            >
              <span className="text-sm text-green-800 mb-1">{label}:</span>
              <input
                type={type}
                value={value}
                onChange={set ? (e) => set(e.target.value) : undefined}
                required={!disabled}
                disabled={disabled}
                className={`px-3 py-2 ${
                  disabled ? "bg-gray-100 cursor-not-allowed border-gray-300" : "bg-green-50 border-green-200"
                } border rounded-md`}
              />
            </label>
          ))}

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

          <button
            type="submit"
            disabled={response.loading}
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

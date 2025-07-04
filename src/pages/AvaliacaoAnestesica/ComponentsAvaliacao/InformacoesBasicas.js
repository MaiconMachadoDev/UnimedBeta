// src/pages/AvaliacaoAnestesica/ComponentsAvaliacao/DadosPacienteAvaliacao.tsx

import { useState, useEffect,useNavigate,ChangeEvent } from "react";
import {  useParams } from "react-router-dom";
import { useFetchDocument } from "../../../hooks/useFetchDocument";
import { useUpdateDocument } from "../../../hooks/useUpdateDocument";
import { useAuthValue } from "../../../context/AuthContext";

const DadosPacienteAvaliacao = () => {
  const { id } = useParams();
  const { document: paciente } = useFetchDocument("clientesCirurgia", id);
  const { updateDocument } = useUpdateDocument("clientesCirurgia");
  const { user } = useAuthValue();

  const [categoria, setCategoria] = useState("");
  const [dataProcedimento, setDataProcedimento] = useState("");
  const [numero, setNumero] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [fone, setFone] = useState("");
  const [diagPreOp, setDiagPreOp] = useState("");
  const [salaCirurgia, setSalaCirurgia] = useState("");
  const [horarioCirurgia, setHorarioCirurgia] = useState("");
  const [cirurgia, setCirurgia] = useState("");
  const [anestesia, setAnestesia] = useState("");
  const [idade, setIdade] = useState("");
  const [sexo, setSexo] = useState("");
  const [cor, setCor] = useState("");
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [pa, setPa] = useState("");
  const [pulso, setPulso] = useState("");
  const [freqResp, setFreqResp] = useState("");
  const [tempAxilar, setTempAxilar] = useState("");
  const [grupoSanguineo, setGrupoSanguineo] = useState("");
  const [imc, setImc] = useState("");
  const [asa,setAsa] = useState("");
  const[antecedentes,setAntecedentes] = useState("");
  const [smoking, setSmoking] = useState("");
  const [stress, setStress] = useState("");
  const [aFamiliar, setAFamiliar] = useState("");
  const [hipertensao, setHipertensao] = useState("");
  const [sedentarismo, setSedentarisimo] = useState("");
  const [alergias, setAlergias] = useState("");
  const [drogasuso, setDrogasUso] = useState("");
  const [doencas, setDoencas] = useState("");
  const [dEndocrinas, setDEndocrinas] = useState("");
  const [dCardiacas, setDCardiacas] = useState("");
  const [dPulmonares, setDPulmonares] = useState("");
  const [dRenais, setDRenais] = useState("");
  const [dNeurologicas, setDNeurologicas] = useState("");
  const [dHepaticas, setDHepaticas] = useState("");



  useEffect(() => {
    if (paciente) {
      setCategoria(paciente.categoria || "");
      setDataProcedimento(paciente.dataProcedimento || "");
      setNumero(paciente.numero || "");
      setCidade(paciente.cidade || "");
      setEstado(paciente.estado || "");
      setFone(paciente.fone || "");
      setDiagPreOp(paciente.diagPreOp || "");
      setSalaCirurgia(paciente.salaCirurgia || "");
      setHorarioCirurgia(paciente.horarioCirurgia || "");
      setCirurgia(paciente.cirurgia || "");
      setAnestesia(paciente.anestesia || "");
      setIdade(paciente.idade?.toString() || "");
      setSexo(paciente.sexo || "");
      setCor(paciente.cor || "");
      setAltura(paciente.altura || "");
      setPeso(paciente.peso || "");
      setPa(paciente.pa || "");
      setPulso(paciente.pulso || "");
      setFreqResp(paciente.freqResp || "");
      setTempAxilar(paciente.tempAxilar || "");
      setGrupoSanguineo(paciente.grupoSanguineo || "");
      setImc(paciente.imc || "");
      setAsa(paciente.asa || "");
      setAntecedentes(paciente.antecedentes || "");
      setSmoking(paciente.smoking || "");
      setStress(paciente.stress || "");
      setAFamiliar(paciente.aFamiliar || "");
      setHipertensao(paciente.hipertensao || "");
      setSedentarisimo(paciente.sedentarisimo || "");
      setAlergias(paciente.alergias || "");
      setDrogasUso(paciente.drogasuso || "");
      setDoencas(paciente.doencas || "");
      setDEndocrinas(paciente.dEndocrinas || "");
      setDCardiacas(paciente.dCardiacas || "");
      setDPulmonares(paciente.dPulmonares || "");
      setDRenais(paciente.dRenais || "");
      setDNeurologicas(paciente.dNeurologicas || "");
      setDHepaticas(paciente.dHepaticas || "");

    }
  }, [paciente]);


 useEffect(() => {
  const pesoNum = parseFloat(peso.replace(",", "."));
  const alturaNum = parseFloat(altura.replace(",", "."));

  if (pesoNum > 0 && alturaNum > 0) {
    const novoImc = (pesoNum / (alturaNum ** 2)).toFixed(2);
    setImc(novoImc);
  } else {
    setImc("");
  }
}, [peso, altura]);

  
 const handleSubmit  = (e)  => {
  e.preventDefault();

  try {
    updateDocument(id, {
      categoria,
      dataProcedimento,
      numero,
      cidade,
      estado,
      fone,
      diagPreOp,
      salaCirurgia,
      horarioCirurgia,
      cirurgia,
      anestesia,
      idade: idade ? parseInt(idade) : "",
      sexo,
      cor,
      altura,
      peso,
      pa,
      pulso,
      freqResp,
      tempAxilar,
      grupoSanguineo,
      imc,
      asa,
      antecedentes,
      smoking,
      stress,
      aFamiliar,
      hipertensao,
      sedentarismo,
      alergias,
      drogasuso,
      doencas,
      dEndocrinas,
      dCardiacas,
      dPulmonares,
      dRenais,
      dNeurologicas,
      dHepaticas,
    });
  } catch (error) {
    console.error("Erro ao atualizar documento:", error);
  }
};
const handleAlturaChange = (e) => {

  let val = e.target.value.replace(/\D/g, "");

  val = val.replace(/^0+(?=\d)/, "");

  if (val.length === 0) {
    setAltura("");
    return;
  }
  if (val.length === 1) {
    setAltura("0,0" + val);
  } else if (val.length === 2) {
    setAltura("0," + val);
  } else {
    const parteInteira = val.slice(0, val.length - 2);
    const parteDecimal = val.slice(-2);
    setAltura(parteInteira + "," + parteDecimal);
  }
};
  return (
   <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        { label: "Data do Procedimento", value: dataProcedimento, set: setDataProcedimento, type: "date" },
        { label: "Horário da Cirurgia", value: horarioCirurgia, set: setHorarioCirurgia, type: "time" },
        { label: "Cirurgia", value: cirurgia, set: setCirurgia },
        { label: "Categoria", value: categoria, set: setCategoria },
        { label: "Nº", value: numero, set: setNumero },
        { label: "Cidade", value: cidade, set: setCidade },
        { label: "Estado", value: estado, set: setEstado },
        { label: "Fone", value: fone, set: setFone },
        { label: "Diag. Pré-Op", value: diagPreOp, set: setDiagPreOp },
        { label: "Anestesia", value: anestesia, set: setAnestesia },
        { label: "Sexo", value: sexo, set: setSexo },
        { label: "Cor", value: cor, set: setCor },
        { label: "Altura (cm)", value: altura, set: handleAlturaChange, raw: true, type: "text" },
        { label: "Peso (kg)", value: peso, set: setPeso },
        { label: "IMC", value: imc, disabled: true },
        { label: "P.A.", value: pa, set: setPa },
        { label: "Pulso", value: pulso, set: setPulso },
        { label: "F. Resp.", value: freqResp, set: setFreqResp },
        { label: "Temp. Axilar", value: tempAxilar, set: setTempAxilar },
        { label: "Grupo Sanguíneo", value: grupoSanguineo, set: setGrupoSanguineo },
        { label: "Antecedentes Anestésicos", value: antecedentes, set: setAntecedentes, span: 2 },
        { label: "Fumo", value: smoking, set: setSmoking },
        { label: "Estresse", value: stress, set: setStress },
        { label: "A. Familiar", value: aFamiliar, set: setAFamiliar },
        { label: "Hipertensão", value: hipertensao, set: setHipertensao },
        { label: "Sedentarismo", value: sedentarismo, set: setSedentarisimo },
        { label: "Alergias", value: alergias, set: setAlergias },
        { label: "Drogas em Uso", value: drogasuso, set: setDrogasUso, span: 2 },
        { label: "Doenças", value: doencas, set: setDoencas, span: 2 },
        { label: "Doenças Endócrinas", value: dEndocrinas, set: setDEndocrinas },
        { label: "Doenças Cardíacas", value: dCardiacas, set: setDCardiacas },
        { label: "Doenças Pulmonares", value: dPulmonares, set: setDPulmonares },
        { label: "Doenças Renais", value: dRenais, set: setDRenais },
        { label: "Doenças Neurológicas", value: dNeurologicas, set: setDNeurologicas },
        { label: "Doenças Hepáticas", value: dHepaticas, set: setDHepaticas },


      ].map(({ label, value, set, type = "text", disabled = false, span, raw = false }, i) => (
          <label key={i} className={`flex flex-col ${span === 2 ? "md:col-span-2" : ""}`}>
          <span className="text-sm text-green-800 mb-1">{label}:</span>
          <input
            type={type}
            value={value}
            onChange={raw ? set : (e) => set(e.target.value)}
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
        <span className="text-sm text-green-800 mb-1">Sala de Cirurgia:</span>
        <select
          value={salaCirurgia}
          onChange={(e) => setAsa(e.target.value)}
          required
          className="px-3 py-2 bg-white border border-green-200 rounded-md"
        >
          <option value="Asa">Asa</option>
          <option value="ASA I">Asa I</option>
          <option value="ASA II">Asa II</option>
          <option value="ASA III">Asa III</option>
          <option value="ASA IV">Asa IV</option>
           <option value="ASA V">Asa V</option>
        </select>
      </label>

      
      
    </form>
  );
};

export default DadosPacienteAvaliacao;
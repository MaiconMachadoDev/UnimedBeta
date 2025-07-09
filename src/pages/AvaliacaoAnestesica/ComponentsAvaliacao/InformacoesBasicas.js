// src/pages/AvaliacaoAnestesica/ComponentsAvaliacao/DadosPacienteAvaliacao.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFetchDocument } from "../../../hooks/useFetchDocument";
import { useUpdateDocument } from "../../../hooks/useUpdateDocument";
import { useAuthValue } from "../../../context/AuthContext";

const DadosPacienteAvaliacao = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { document: paciente } = useFetchDocument("clientesCirurgia", id);
  const { updateDocument,response  } = useUpdateDocument("clientesCirurgia");
  const { user } = useAuthValue();

  
  const [nomeSocial, setNomeSocial] = useState("");
  const [nomePaciente, setNomePaciente] = useState("");
  const [nomeMae, setNomeMae] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
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
  const [sedentarismo, setSedentarismo] = useState("");
  const [alergias, setAlergias] = useState("");
  const [drogasuso, setDrogasUso] = useState("");
  const [doencas, setDoencas] = useState("");
  const [dEndocrinas, setDEndocrinas] = useState("");
  const [dCardiacas, setDCardiacas] = useState("");
  const [dPulmonares, setDPulmonares] = useState("");
  const [dRenais, setDRenais] = useState("");
  const [dNeurologicas, setDNeurologicas] = useState("");
  const [dHepaticas, setDHepaticas] = useState("");
  const [exameFisico, setExameFisico] = useState("");
  const [cabecaPescoço, setCabecaPescoco] = useState("");
  const [apVascular, setApVascular] = useState("");
  const [ecg , setEcg] = useState("");
  const [rx, setRx] = useState("");
  const [eco , setEco] = useState("");
  const [apRespiratorio, setApRespiratorio] = useState("");
  const [mallamPati, setMallamPati] = useState("");
  const [enfisema, setEnfisema] = useState("");
  const [asma, setAsma] = useState("");
  const [labHemacias, setLabHemacias] = useState("");
  const [labHb, setLabHb] = useState("");
  const [labHtc, setLabHtc] = useState("");
  const [labLeucocitos, setLabLeucocitos] = useState("");
  const [labPlaquetas, setLabPlaquetas] = useState("");
  const [labGlicemia, setLabGlicemia] = useState("");
  const [labCreatinina, setLabCreatinina] = useState("");
  const [labUreia, setLabUreia] = useState("");
  const [labProtTotal, setLabProtTotal] = useState("");
  const [labRni , setLabRni] = useState("");
  const [AvaliacaoAnestesica, setAvaliacaoAnestesica] = useState(false);


  useEffect(() => {
    if (paciente) {
       setNomeSocial(paciente.nomeSocial || paciente.nome || "");
      setNomePaciente(paciente.nome || "");
      setNomeMae(paciente.mae || "");
      setDataNascimento(paciente.nascimento || "");
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
      setSedentarismo(paciente.sedentarismo || "");
      setAlergias(paciente.alergias || "");
      setDrogasUso(paciente.drogasuso || "");
      setDoencas(paciente.doencas || "");
      setDEndocrinas(paciente.dEndocrinas || "");
      setDCardiacas(paciente.dCardiacas || "");
      setDPulmonares(paciente.dPulmonares || "");
      setDRenais(paciente.dRenais || "");
      setDNeurologicas(paciente.dNeurologicas || "");
      setDHepaticas(paciente.dHepaticas || "");
      setExameFisico(paciente.exameFisico || "");
      setCabecaPescoco(paciente.cabecaPescoço || "");
      setApVascular(paciente.apVascular || "");
      setEcg(paciente.ecg || "");
      setRx(paciente.rx || "");
      setEco(paciente.eco || "");
      setApRespiratorio(paciente.apRespiratorio || "");
      setMallamPati(paciente.mallamPati || "");
      setEnfisema(paciente.enfisema || "");
      setAsma(paciente.asma || "");
      setLabHemacias(paciente.labHemacias || "");
      setLabHb(paciente.labHb || "");
      setLabHtc(paciente.labHtc || "");
      setLabLeucocitos(paciente.labLeucocitos || "");
      setLabPlaquetas(paciente.labPlaquetas || "");
      setLabGlicemia(paciente.labGlicemia || "");
      setLabCreatinina(paciente.labCreatinina || "");
      setLabUreia(paciente.labUreia || "");
      setLabProtTotal(paciente.labProtTotal || "");
      setLabRni(paciente.labRni || "");


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

  
const handleSubmit = (e) => {
  e.preventDefault();

  try {
    // Cria o objeto base com todos os dados comuns
    const updatedData = {
      nome: nomePaciente,
      mae: nomeMae,
      nascimento: dataNascimento,
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
      exameFisico,
      cabecaPescoço,
      apVascular,
      ecg,
      rx,
      eco,
      apRespiratorio,
      mallamPati,
      enfisema,
      asma,
      labHemacias,
      labHb,
      labHtc,
      labLeucocitos,
      labPlaquetas,
      labGlicemia,
      labCreatinina,
      labUreia,
      labProtTotal,
      labRni,
      AvaliacaoAnestesica: true,
      uid: user.uid,
    };

    // Só adiciona nomeSocial se for diferente do nomePaciente e não vazio
    if (nomeSocial && nomeSocial !== nomePaciente) {
      updatedData.nomeSocial = nomeSocial;
    }

    // Atualiza no banco
    updateDocument(id, updatedData);

    navigate("/dashboard");
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
      <section className="md:col-span-2">
        <h2 className="text-xl font-semibold text-green-900 mb-4">Dados Pessoais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div >
          <label className="block text-sm font-medium text-green-700">Nome Social</label>
          <input
            type="text"
            value={nomeSocial}
            onChange={(e) => setNomeSocial(e.target.value)}
            className="mt-1 block w-full rounded-md border-green-200 bg-white shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-green-700">Nome do Paciente</label>
          <input
            type="text"
            value={nomePaciente}
            onChange={(e) => setNomePaciente(e.target.value)}
            className="mt-1 block w-full rounded-md border-green-200 bg-white shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-green-700">Nome da Mãe</label>
          <input
            type="text"
            value={nomeMae}
            onChange={(e) => setNomeMae(e.target.value)}
            className="mt-1 block w-full rounded-md border-green-200 bg-white shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-green-700">Data de Nascimento</label>
          <input
            type="date"
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
            className="mt-1 block w-full rounded-md border-green-200 bg-white shadow-sm"
          />
        </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <span className="text-sm text-green-800 mb-1">Sexo:</span>
            <select
                  value={sexo}
                  onChange={(e) => setSexo(e.target.value)}
                  required
                  className="px-3 py-2 bg-white border border-green-200 rounded-md "
                    >
                  <option value="Select">Selecione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </select>
          </label>
           {[
          { label: "Data do Procedimento", value: dataProcedimento, set: setDataProcedimento, type: "date" },
          { label: "Horário da Cirurgia", value: horarioCirurgia, set: setHorarioCirurgia, type: "time" },
          { label: "Cirurgia", value: cirurgia, set: setCirurgia },
          { label: "Categoria", value: categoria, set: setCategoria },
          { label: "Nº", value: numero, set: setNumero },
          { label: "Cidade", value: cidade, set: setCidade,required: true,placeholder: "Digite o nome da Cidade" },
          { label: "Estado", value: estado, set: setEstado ,required: true,placeholder: "Digite o nome do Estado"},
          { label: "Fone", value: fone, set: setFone, type:"tel", placeholder: "(99) 99999-9999" ,required: true},
          { label: "Diag. Pré-Op", value: diagPreOp, set: setDiagPreOp },
          { label: "Anestesia", value: anestesia, set: setAnestesia ,placeholder: "Digite o tipo de Anestesia"},
          { label: "Cor", value: cor, set: setCor ,placeholder: "Digite a Cor"},
          { label: "Altura (cm)", value: altura, set: handleAlturaChange, raw: true, type: "text",required: true,placeholder: "Digite a Altura (cm)"},
          { label: "Peso (kg)", value: peso, set: setPeso ,required: true,placeholder: "Digite o Peso (kg)"},
          { label: "IMC", value: imc, disabled: true ,placeholder: "IMC Calculado Automaticamente" },
          { label: "P.A.", value: pa, set: setPa ,required: true,placeholder: "Digite a Pressão Arterial (mmHg)"},
          { label: "Pulso", value: pulso, set: setPulso ,required: true,placeholder: "Digite o Pulso (bpm)"},
          { label: "F. Resp.", value: freqResp, set: setFreqResp,required: true,placeholder: "Digite a Frequência Respiratória (rpm)"},
          { label: "Temp. Axilar", value: tempAxilar, set: setTempAxilar,required: true,placeholder: "Digite a Temperatura Axilar (°C)"},
          { label: "Grupo Sanguíneo", value: grupoSanguineo, set: setGrupoSanguineo ,required: true,placeholder: "Digite o Grupo Sanguíneo"},
          { label: "Antecedentes Anestésicos", value: antecedentes, set: setAntecedentes, span: 2 ,placeholder: "Descreva os Antecedentes Anestésicos" ,type: "textarea"},
        ].map(({ label, value, set, type = "text", disabled = false, span, raw = false ,placeholder }, i) => (
          <label key={i} className={`flex flex-col ${span === 2 ? "md:col-span" : ""}`}>
            <span className="text-sm text-green-800 mb-1">{label}:</span>
            {type === "textarea" ? (
              <textarea
                rows={4}
                value={value}
                onChange={raw ? set : (e) => set(e.target.value)}
                placeholder={placeholder}
                required={!disabled}
                disabled={disabled}
                className={`px-3 py-2 resize-y ${
                  disabled ? "bg-gray-100 cursor-not-allowed border-gray-300" : "bg-green-50 border-green-200"
                } border rounded-md`}
              />
            ) : (
              <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={raw ? set : (e) => set(e.target.value)}
                required={!disabled}
                disabled={disabled}
                className={`px-3 py-2 ${
                  disabled ? "bg-gray-100 cursor-not-allowed border-gray-300" : "bg-green-50 border-green-200"
                } border rounded-md`}
              />
              
            )}
          </label>
        ))}
        </div>
       
      </section>
      <section className="md:col-span-2">
        <h2 className="text-xl font-semibold text-green-900 mb-4">Dados Clinicos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
          { label: "Fumo", value: smoking, set: setSmoking ,placeholder: "Descreva o Fumo" },
          { label: "Estresse", value: stress, set: setStress ,placeholder: "Descreva o Estresse" },
          { label: "A. Familiar", value: aFamiliar, set: setAFamiliar,placeholder : "Descreva a A. Familiar" },
          { label: "Hipertensão", value: hipertensao, set: setHipertensao,placeholder: "Descreva a Hipertensão" },
          { label: "Sedentarismo", value: sedentarismo, set: setSedentarismo ,placeholder: "Descreva o Sedentarismo" },
          { label: "Alergias", value: alergias, set: setAlergias ,placeholder: "Descreva as Alergias" },
          { label: "Drogas em Uso", value: drogasuso, set: setDrogasUso, span: 2 ,placeholder: "Descreva as Drogas em Uso" },
          { label: "Doenças Endócrinas", value: dEndocrinas, set: setDEndocrinas ,placeholder: "Descreva as Doenças Endócrinas" },
          { label: "Doenças Cardíacas", value: dCardiacas, set: setDCardiacas ,placeholder: "Descreva as Doenças Cardíacas" },
          { label: "Doenças Pulmonares", value: dPulmonares, set: setDPulmonares,placeholder: "Descreva as Doenças Pulmonares" },
          { label: "Doenças Renais", value: dRenais, set: setDRenais ,placeholder: "Descreva as Doenças Renais" },
          { label: "Doenças Neurológicas", value: dNeurologicas, set: setDNeurologicas,placeholder: "Descreva as Doenças Neurológicas" },
          { label: "Doenças Hepáticas", value: dHepaticas, set: setDHepaticas ,placeholder: "Descreva as Doenças Hepáticas" },
          { label: "Exame Físico", value: exameFisico, set: setExameFisico,   type: "textarea",placeholder: "Descreva o Exame Físico" },
          { label: "Doenças", value: doencas, set: setDoencas, type: "textarea",placeholder: "Descreva as Doenças" },
          { label: "Cabeça e Pescoço", value: cabecaPescoço, set: setCabecaPescoco,placeholder: "Descreva o exame de Cabeça e Pescoço", },
          { label: "A.P. Vascular", value: apVascular, set: setApVascular },
        ].map(({ label, value, set, type = "text", disabled = false, span, raw = false ,placeholder}, i) => (
          <label key={i} className={`flex flex-col ${span === 2 ? "md:col-span-2" : ""}`}>
            <span className="text-sm text-green-800 mb-1">{label}:</span>
            {type === "textarea" ? (
              <textarea
                rows={4}
                value={value}
                placeholder={placeholder}
                onChange={raw ? set : (e) => set(e.target.value)}
                required={!disabled}
                disabled={disabled}
                className={`px-3 py-2 resize-y ${
                  disabled ? "bg-gray-100 cursor-not-allowed border-gray-300" : "bg-green-50 border-green-200"
                } border rounded-md`}
              />
            ) : (
              <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={raw ? set : (e) => set(e.target.value)}
                required={!disabled}
                disabled={disabled}
                className={`px-3 py-2 ${
                  disabled ? "bg-gray-100 cursor-not-allowed border-gray-300" : "bg-green-50 border-green-200"
                } border rounded-md`}
              />
            )}
          </label>
        ))}
        <label className="flex flex-col">
        <span className="text-sm text-green-800 mb-1">ASA:</span>
        <select
          value={salaCirurgia}
          onChange={(e) => setAsa(e.target.value)}
          required
          className="px-3 py-2 bg-white border border-green-200 rounded-md"
        >
          <option value="Asa">Selecione</option>
          <option value="ASA I">Asa I</option>
          <option value="ASA II">Asa II</option>
          <option value="ASA III">Asa III</option>
          <option value="ASA IV">Asa IV</option>
           <option value="ASA V">Asa V</option>
        </select>
      </label>
      <label className="flex flex-col">
        <span className="text-sm text-green-800 mb-1">MALLAMPATI:</span>
        <select
          value={mallamPati}
          onChange={(e) => setAsa(e.target.value)}
          required
          className="px-3 py-2 bg-white border border-green-200 rounded-md"
        >
          <option value="Asa">Seleciona</option>
          <option value="MALLAMPATI1">MALLAMPATI I</option>
          <option value="MALLAMPATI2">MALLAMPATI II</option>
          <option value="MALLAMPATI3">MALLAMPATI III</option>
          <option value="MALLAMPATI4">MALLAMPATI IV</option>
           <option value="MALLAMPATI5">MALLAMPAT IV</option>
        </select>
      </label>
        </div>
      </section>
      <section className="md:col-span-2">
        <h2 className="text-xl font-semibold text-green-900 mb-4">Exames</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
          { label: "Eletrocardiograma", value: ecg, set: setEcg,placeholder: "Digite o resultado do Eletrocardiograma" },
          { label: "Raio-X", value: rx, set: setRx,placeholder: "Digite o resultado do Raio-X" },
          { label: "Ecocardiograma", value: eco, set: setEco,placeholder: "Digite o resultado do Ecocardiograma" },
          { label: "A.P. Respiratório", value: apRespiratorio, set: setApRespiratorio,placeholder: "Digite o resultado da A.P. Respiratório" },
          { label: "Enfisema", value: enfisema, set: setEnfisema,placeholder: "Digite o resultado do Enfisema" },
          { label: "Asma", value: asma, set: setAsma,placeholder: "Asma" },
          { label: "Hemácias", value: labHemacias, set: setLabHemacias,placeholder: "Digite o resultado das Hemácias" },
          { label: "Hb", value: labHb, set: setLabHb ,placeholder: "Digite o resultado da Hemoglobina" },
          { label: "Htc", value: labHtc, set: setLabHtc ,placeholder: "Digite o resultado do Hematócrito" },
          { label: "Leucócitos", value: labLeucocitos, set: setLabLeucocitos ,placeholder: "Digite o resultado dos Leucócitos" },
          { label: "Plaquetas", value: labPlaquetas, set: setLabPlaquetas,placeholder: "Digite o resultado das Plaquetas" },
          { label: "Glicemia", value: labGlicemia, set: setLabGlicemia,placeholder: "Digite o resultado da Glicemia" },
          { label: "Creatinina", value: labCreatinina, set: setLabCreatinina,placeholder: "Digite o resultado da Creatinina" },
          { label: "Ureia", value: labUreia, set: setLabUreia ,placeholder: "Digite o resultado da Ureia" },
          { label: "Proteínas Totais", value: labProtTotal, set: setLabProtTotal ,placeholder: "Digite o resultado das Proteínas Totais" },
          { label:"RNI",value :labRni,set:setLabRni,placeholder: "Digite o resultado do RNI" },

].map(({ label, value, set, type = "text", disabled = false, span, raw = false ,placeholder}, i) => (
          <label key={i} className={`flex flex-col ${span === 2 ? "md:col-span-2" : ""}`}>
            <span className="text-sm text-green-800 mb-1">{label}:</span>
            {type === "textarea" ? (
              <textarea
                rows={4}
                value={value}
                placeholder={placeholder}
                onChange={raw ? set : (e) => set(e.target.value)}
                required={!disabled}
                disabled={disabled}
                className={`px-3 py-2 resize-y ${
                  disabled ? "bg-gray-100 cursor-not-allowed border-gray-300" : "bg-green-50 border-green-200"
                } border rounded-md`}
              />
            ) : (
              <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={raw ? set : (e) => set(e.target.value)}
                required={!disabled}
                disabled={disabled}
                className={`px-3 py-2 ${
                  disabled ? "bg-gray-100 cursor-not-allowed border-gray-300" : "bg-green-50 border-green-200"
                } border rounded-md`}
              />
            )}
          </label>
        ))}
           
        </div>
      </section>

    <button
            type="submit"
            disabled={response.loading}
            className="md:col-span-2 mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition duration-300"
          >
            {response.loading ? "Avaliando..." : "Avaliar Cliente"}
          </button>
      
    </form>
  );
};

export default DadosPacienteAvaliacao;
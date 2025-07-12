import { useState, useEffect, useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon, EyeIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { useFetchDocuments } from "../../hooks/UseFetchDocuments";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

const salasDisponiveis = ["Sala 01", "Sala 02", "Sala 03", "Bera"];

function formatDataBR(date) {
  if (!date) return "-";
  return date.toLocaleDateString("pt-BR");
}

function gerarDiasMes(ano, mes) {
  const totalDias = new Date(ano, mes + 1, 0).getDate();
  let dias = [];
  for (let i = 1; i <= totalDias; i++) {
    dias.push(i);
  }
  return dias;
}

function parseDataLocal(dateString) {
  if (!dateString) return null;
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export default function MapaCirurgico() {
    
  const { documents: pacientes, loading } = useFetchDocuments("clientesCirurgia");

  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [salaSelecionada, setSalaSelecionada] = useState(null);

  const [calMes, setCalMes] = useState(dataSelecionada.getMonth());
  const [calAno, setCalAno] = useState(dataSelecionada.getFullYear());
   const [showExport, setShowExport] = useState(false);

  const calendarioRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarioRef.current && !calendarioRef.current.contains(event.target)) {
        setMostrarCalendario(false);
      }
    }
    if (mostrarCalendario) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mostrarCalendario]);

  const pacientesFiltrados = pacientes
    ? pacientes.filter((p) => {
        if (!p.dataProcedimento) return false;
        const dataProc = parseDataLocal(p.dataProcedimento);
        if (!dataProc) return false;

        const mesmaData =
          dataProc.getFullYear() === dataSelecionada.getFullYear() &&
          dataProc.getMonth() === dataSelecionada.getMonth() &&
          dataProc.getDate() === dataSelecionada.getDate();

        const mesmaSala = salaSelecionada ? p.salaCirurgia === salaSelecionada : true;

        return mesmaData && mesmaSala;
      })
    : [];

  const temOpme = pacientesFiltrados.some((p) => p.opme && p.opme.toLowerCase() === "sim");
  const temRaioX = pacientesFiltrados.some((p) => p.raiox && p.raiox.toLowerCase() === "sim");
  const temScopia = pacientesFiltrados.some((p) => p.scopia && p.scopia.toLowerCase() === "sim");
  const temArmarioVideo = pacientesFiltrados.some(
    (p) => p.armarioVideo && p.armarioVideo.toLowerCase() === "sim"
  );

  function selecionarDia(dia) {
    setDataSelecionada(new Date(calAno, calMes, dia));
    setMostrarCalendario(false);
  }

  function mudarMes(diff) {
    let novoMes = calMes + diff;
    let novoAno = calAno;
    if (novoMes < 0) {
      novoMes = 11;
      novoAno -= 1;
    } else if (novoMes > 11) {
      novoMes = 0;
      novoAno += 1;
    }
    setCalMes(novoMes);
    setCalAno(novoAno);
  }
   function exportarTabelaPDF() {
  // Filtra apenas pela data, não pela sala
  const pacientesDoDia = pacientes
    ? pacientes.filter((p) => {
        if (!p.dataProcedimento) return false;
        const dataProc = parseDataLocal(p.dataProcedimento);
        if (!dataProc) return false;
        return (
          dataProc.getFullYear() === dataSelecionada.getFullYear() &&
          dataProc.getMonth() === dataSelecionada.getMonth() &&
          dataProc.getDate() === dataSelecionada.getDate()
        );
      })
    : [];

  // Ordem desejada das salas
  const ordemSalas = ["Bera", "Sala 01", "Sala 02", "Sala 03"];

  // Ordena os pacientes pela ordem das salas
  const pacientesOrdenados = [...pacientesDoDia].sort((a, b) => {
    const ordemSalas = ["Bera", "Sala 01", "Sala 02", "Sala 03"];
    const idxA = ordemSalas.indexOf(a.salaCirurgia);
    const idxB = ordemSalas.indexOf(b.salaCirurgia);
    // Ordena por sala
    if ((idxA === -1 ? 99 : idxA) !== (idxB === -1 ? 99 : idxB)) {
      return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
    }
    // Se for a mesma sala, ordena por horário (assumindo formato HH:mm)
    if (a.horarioCirurgia && b.horarioCirurgia) {
      return a.horarioCirurgia.localeCompare(b.horarioCirurgia);
    }
    // Se algum não tem horário, joga para o final
    if (!a.horarioCirurgia) return 1;
    if (!b.horarioCirurgia) return -1;
    return 0;
  });

  // Checa se há colunas extras
  const temOpme = pacientesOrdenados.some((p) => p.opme && p.opme.toLowerCase() === "sim");
  const temRaioX = pacientesOrdenados.some((p) => p.raiox && p.raiox.toLowerCase() === "sim");
  const temScopia = pacientesOrdenados.some((p) => p.scopia && p.scopia.toLowerCase() === "sim");
  const temArmarioVideo = pacientesOrdenados.some(
    (p) => p.armarioVideo && p.armarioVideo.toLowerCase() === "sim"
  );

  // Cabeçalho igual ao da tabela
  const header = [
    "Horário",
    "Paciente",
    "Cirurgia",
    ...(temOpme ? ["OPME"] : []),
    ...(temRaioX ? ["Raio X"] : []),
    ...(temScopia ? ["Scopia"] : []),
    ...(temArmarioVideo ? ["Armário Vídeo"] : []),
    "Médico",
    "Sala",
    "Avaliação Anestesia",
  ];

  // Corpo igual ao da tabela
  const body = pacientesOrdenados.map((p) => [
    p.horarioCirurgia || "-",
    p.nome,
    p.cirurgia || "-",
    ...(temOpme ? [p.opme?.toLowerCase() === "sim" ? "Sim" : "-"] : []),
    ...(temRaioX ? [p.raiox?.toLowerCase() === "sim" ? "Sim" : "-"] : []),
    ...(temScopia ? [p.scopia?.toLowerCase() === "sim" ? "Sim" : "-"] : []),
    ...(temArmarioVideo ? [p.armarioVideo?.toLowerCase() === "sim" ? "Sim" : "-"] : []),
    p.medico || "-",
    p.salaCirurgia || "-",
    p.AvaliacaoAnestesica ? "Sim" : "Não",
  ]);

  const docDefinition = {
    pageOrientation: "landscape",
    content: [
      {
        text: `Mapa Cirúrgico - ${formatDataBR(dataSelecionada)}`,
        style: "header",
        alignment: "center",
        margin: [0, 0, 0, 10],
      },
      {
        table: {
          headerRows: 1,
          widths: Array(header.length).fill("*"),
          body: [header, ...body],
        },
        layout: {
          fillColor: (rowIndex) => {
            if (rowIndex === 0) return "#bbf7d0";
            return rowIndex % 2 === 0 ? "#fff" : "#f0fdf4";
          },
          hLineColor: () => "#d1fae5",
          vLineColor: () => "#d1fae5",
        },
        margin: [0, 0, 0, 0],
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        color: "#166534",
      },
      tableHeader: {
        fillColor: "#bbf7d0",
        color: "#166534",
        bold: true,
        fontSize: 12,
        alignment: "center",
        margin: [0, 4, 0, 4],
      },
      tableCell: {
        fontSize: 11,
        color: "#14532d",
        margin: [0, 3, 0, 3],
      },
      tableCellBold: {
        fontSize: 11,
        color: "#14532d",
        bold: true,
        margin: [0, 3, 0, 3],
      },
      tableCellCenter: {
        fontSize: 11,
        alignment: "center",
        margin: [0, 3, 0, 3],
      },
      tableCellSim: {
        fontSize: 11,
        alignment: "center",
        bold: true,
        color: "#15803d",
        margin: [0, 3, 0, 3],
      },
      tableCellNao: {
        fontSize: 11,
        alignment: "center",
        bold: true,
        color: "#dc2626",
        margin: [0, 3, 0, 3],
      },
    },
    // Remova o bloco defaultStyle se tiver font: "Roboto"
  };

  pdfMake.createPdf(docDefinition).download("Mapa_Cirurgico.pdf");
  setShowExport(false);
}

  return (
    <div className="max-w-7xl mx-auto p-4 bg-green-50 rounded-lg shadow mt-8">
            <div className="flex justify-end ">
            <button
            onClick={() => setShowExport(true)}
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 text-white transition"
            >
            Export
            </button>
        </div>
      {/* Barra de seleção de data */}
      <div className="flex items-center justify-center gap-4 mb-6 relative">
        <button
          onClick={() => {
            const novaData = new Date(dataSelecionada);
            novaData.setDate(novaData.getDate() - 1);
            setDataSelecionada(novaData);
            setCalMes(novaData.getMonth());
            setCalAno(novaData.getFullYear());
          }}
          className="p-2 bg-green-600 rounded hover:bg-green-700 transition"
          aria-label="Dia anterior"
        >
          <ChevronLeftIcon className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={() => setMostrarCalendario(!mostrarCalendario)}
          className="flex items-center gap-2 text-green-900 font-semibold text-lg cursor-pointer select-none px-3 py-1 border border-green-700 rounded"
          aria-label="Selecionar data"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {formatDataBR(dataSelecionada)}
        </button>

        <button
          onClick={() => {
            const novaData = new Date(dataSelecionada);
            novaData.setDate(novaData.getDate() + 1);
            setDataSelecionada(novaData);
            setCalMes(novaData.getMonth());
            setCalAno(novaData.getFullYear());
          }}
          className="p-2 bg-green-600 rounded hover:bg-green-700 transition"
          aria-label="Próximo dia"
        >
          <ChevronRightIcon className="w-6 h-6 text-white" />
        </button>

        {mostrarCalendario && (
          <div
            ref={calendarioRef}
            className="absolute top-full mt-2 bg-white border border-green-300 rounded shadow p-4 z-50"
            style={{ width: 280 }}
          >
            
            <div className="flex justify-between items-center mb-2">
              <button
                onClick={() => mudarMes(-1)}
                className="p-1 hover:bg-green-100 rounded"
                aria-label="Mês anterior"
              >
                &lt;
              </button>
              <div className="font-semibold text-green-800">
                {new Date(calAno, calMes).toLocaleString("pt-BR", {
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <button
                onClick={() => mudarMes(1)}
                className="p-1 hover:bg-green-100 rounded"
                aria-label="Próximo mês"
              >
                &gt;
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-green-600 font-semibold text-xs mb-1">
              {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {[...Array(new Date(calAno, calMes, 1).getDay()).keys()].map((_, i) => (
                <div key={"empty" + i} />
              ))}

              {gerarDiasMes(calAno, calMes).map((dia) => {
                const isSelected =
                  dia === dataSelecionada.getDate() &&
                  calMes === dataSelecionada.getMonth() &&
                  calAno === dataSelecionada.getFullYear();
                return (
                  <button
                    key={dia}
                    onClick={() => selecionarDia(dia)}
                    className={`py-1 rounded hover:bg-green-200 transition ${
                      isSelected ? "bg-green-600 text-white font-bold" : "text-green-800"
                    }`}
                    aria-label={`Selecionar dia ${dia}`}
                  >
                    {dia}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

        {/* Botões das salas */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button
            onClick={() => setSalaSelecionada(null)}
            className={`px-4 py-2 rounded font-semibold ${
                salaSelecionada === null
                ? "bg-green-800 text-white"
                : "bg-green-200 text-green-900 hover:bg-green-300"
            } transition`}
            >
            Todas
            </button>
            {salasDisponiveis.map((sala) => (
            <button
                key={sala}
                onClick={() => setSalaSelecionada(sala)}
                className={`px-4 py-2 rounded font-semibold ${
                salaSelecionada === sala
                    ? "bg-green-800 text-white"
                    : "bg-green-200 text-green-900 hover:bg-green-300"
                } transition`}
            >
                {sala}
            </button>
            ))}
        
        </div>
      
       
      

      {/* Tabela */}
      {loading && (
        <p className="text-green-600 text-center font-medium">Carregando pacientes...</p>
      )}

      {!loading && pacientesFiltrados.length === 0 && (
        <p className="text-center text-green-700 font-semibold">
          Nenhum paciente encontrado para essa data e sala.
        </p>
      )}

      {!loading && pacientesFiltrados.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full table-auto bg-white rounded shadow">
            <thead className="bg-green-200 text-green-800 font-semibold">
              <tr>
                <th className="px-4 py-2 text-left">Horário</th>
                <th className="px-4 py-2 text-left">Paciente</th>
                <th className="px-4 py-2 text-left">Cirurgia</th>
                {temOpme && <th className="px-4 py-2 text-center">OPME</th>}
                {temRaioX && <th className="px-4 py-2 text-center">Raio X</th>}
                {temScopia && <th className="px-4 py-2 text-center">Scopia</th>}
                {temArmarioVideo && <th className="px-4 py-2 text-center">Armário Vídeo</th>}
                <th className="px-4 py-2 text-left">Médico</th>
                <th className="px-4 py-2 text-left">Sala</th>
                <th className="px-4 py-2 text-center">Avaliação Anestesia</th>
                <th className="px-4 py-2 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {[...pacientesFiltrados]
                .sort((a, b) => {
                  const ordemSalas = ["Bera", "Sala 01", "Sala 02", "Sala 03"];
                  const idxA = ordemSalas.indexOf(a.salaCirurgia);
                  const idxB = ordemSalas.indexOf(b.salaCirurgia);
                  if ((idxA === -1 ? 99 : idxA) !== (idxB === -1 ? 99 : idxB)) {
                    return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
                  }
                  if (a.horarioCirurgia && b.horarioCirurgia) {
                    return a.horarioCirurgia.localeCompare(b.horarioCirurgia);
                  }
                  if (!a.horarioCirurgia) return 1;
                  if (!b.horarioCirurgia) return -1;
                  return 0;
                })
                .map((p) => (
                  <tr
                    key={p.id || p.uid}
                    className="border-b border-green-100 hover:bg-green-50"
                  >
                    <td className="px-4 py-2">{p.horarioCirurgia || "-"}</td>
                    <td className="px-4 py-2 font-medium text-green-900">{p.nome}</td>
                    <td className="px-4 py-2">{p.cirurgia || "-"}</td>
                    {temOpme && (
                      <td className="px-4 py-2 text-center">
                        {p.opme && p.opme.toLowerCase() === "sim" ? "Sim" : "-"}
                      </td>
                    )}
                    {temRaioX && (
                      <td className="px-4 py-2 text-center">
                        {p.raiox && p.raiox.toLowerCase() === "sim" ? "Sim" : "-"}
                      </td>
                    )}
                    {temScopia && (
                      <td className="px-4 py-2 text-center">
                        {p.scopia && p.scopia.toLowerCase() === "sim" ? "Sim" : "-"}
                      </td>
                    )}
                    {temArmarioVideo && (
                      <td className="px-4 py-2 text-center">
                        {p.armarioVideo && p.armarioVideo.toLowerCase() === "sim" ? "Sim" : "-"}
                      </td>
                    )}
                    <td className="px-4 py-2">{p.medico || "-"}</td>
                    <td className="px-4 py-2">{p.salaCirurgia || "-"}</td>
                    <td className="px-4 py-2 text-center font-semibold">
                      {p.AvaliacaoAnestesica ? (
                        <span className="text-green-700">Sim</span>
                      ) : (
                        <span className="text-red-600">Não</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <Link
                       to={`/paciente/${p.id || p.uid}`}
                       target="_blank"
                       state={{ from: "/cirurgias/mapa",selectedDate: dataSelecionada    }}
                        className="p-2 border border-blue-500 text-blue-500 bg-white rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
                        title="Visualizar Paciente"
                        
                      >
                        <EyeIcon className="w-5 h-5" />
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
        {/* ───── Modal Export ───── */}
      {showExport && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-64 text-center space-y-4">
            <h3 className="text-lg font-bold text-green-900">Exportar</h3>
            <button
              onClick={exportarTabelaPDF}
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              PDF
            </button>
            <button
              onClick={() => setShowExport(false)}
              className="w-full px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
    
  );
}

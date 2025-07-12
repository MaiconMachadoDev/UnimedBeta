import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useFetchDocuments } from "../../hooks/UseFetchDocuments";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  TvIcon,
} from "@heroicons/react/24/solid";

// Função para converter string 'YYYY-MM-DD' em Date local
function parseDataLocal(dateString) {
  if (!dateString) return null;
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

const Dashboard = () => {
  const [sortConfig, setSortConfig] = useState(null);
  const [sortedPatients, setSortedPatients] = useState([]);
  const { documents: pacientes, loading } = useFetchDocuments("clientesCirurgia");

  const [showModal, setShowModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (pacientes) {
      let sorted = [...pacientes];
      if (sortConfig !== null) {
        sorted.sort((a, b) => {
          let aVal = a[sortConfig.key];
          let bVal = b[sortConfig.key];

          // Para dataProcedimento, converter para Date para comparar
          if (sortConfig.key === "dataProcedimento") {
            aVal = parseDataLocal(aVal)?.getTime() || 0;
            bVal = parseDataLocal(bVal)?.getTime() || 0;
          }

          // Para createdAt que é timestamp do Firebase
          if (sortConfig.key === "createdAt") {
            aVal = aVal?.seconds || 0;
            bVal = bVal?.seconds || 0;
          }

          if (aVal < bVal) {
            return sortConfig.direction === "asc" ? -1 : 1;
          }
          if (aVal > bVal) {
            return sortConfig.direction === "asc" ? 1 : -1;
          }
          return 0;
        });
      }
      setSortedPatients(sorted);
    }
  }, [pacientes, sortConfig]);

  const handleSort = (key, direction) => {
    setSortConfig({ key, direction });
  };

  const handleDeleteClick = (id) => {
    setSelectedPatientId(id);
    setShowModal(true);
    setIsChecked(false);
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedPatientId(null);
    setIsChecked(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 bg-green-50 rounded-lg shadow mt-8">
      <h2 className="text-3xl font-bold text-green-800 text-center mb-2">
        Pacientes Cirúrgicos Cadastrados
      </h2>
      <p className="text-green-700 text-center mb-6">
        Gerencie os pacientes cadastrados e seus procedimentos
      </p>

      {loading && (
        <p className="text-green-600 text-center font-medium">Carregando pacientes...</p>
      )}

      {!loading && pacientes?.length === 0 ? (
        <div className="text-center p-8 bg-white border border-green-200 rounded-md">
          <p className="mb-4 text-green-700 font-semibold">Nenhum paciente encontrado.</p>
          <Link
            to="/cadastro"
            className="inline-block px-6 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition"
          >
            Cadastrar novo paciente
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {/* Cabeçalho escondido no mobile, visível em telas md+ */}
          <div className="hidden md:grid grid-cols-7 gap-4 font-semibold text-green-800 border-b-2 border-green-300 pb-2 mb-2 text-sm">
            <div className="col-span-2">Paciente</div>
            <div
              className="cursor-pointer select-none"
              onClick={() => {
                if (sortConfig?.key === "dataProcedimento" && sortConfig.direction === "asc") {
                  handleSort("dataProcedimento", "desc");
                } else {
                  handleSort("dataProcedimento", "asc");
                }
              }}
            >
              Data{" "}
              {sortConfig?.key === "dataProcedimento" ? (
                sortConfig.direction === "asc" ? (
                  <ChevronUpIcon className="inline w-4 h-4" />
                ) : (
                  <ChevronDownIcon className="inline w-4 h-4" />
                )
              ) : null}
            </div>
            <div>Sala</div>
            <div>Horário</div>
            <div>Médico</div>
            <div className="text-center">Ações</div>
          </div>

          {sortedPatients.map((paciente) => (
            <div
              key={paciente.id || paciente.uid}
              className="bg-white rounded-lg shadow p-4 flex flex-col md:grid md:grid-cols-7 gap-2 md:items-center"
            >
              <div className="col-span-2">
                <span className="md:hidden text-xs text-green-700 font-semibold">Paciente:</span>
                <p className="text-green-900 font-medium">{paciente.nome}</p>
              </div>

              <div>
                <span className="md:hidden text-xs text-green-700 font-semibold">Data:</span>
                <p>
                  {paciente.dataProcedimento
                    ? parseDataLocal(paciente.dataProcedimento).toLocaleDateString("pt-BR")
                    : "-"}
                </p>
              </div>

              <div>
                <span className="md:hidden text-xs text-green-700 font-semibold">Sala:</span>
                <p>{paciente.salaCirurgia || "-"}</p>
              </div>

              <div>
                <span className="md:hidden text-xs text-green-700 font-semibold">Horário:</span>
                <p>{paciente.horarioCirurgia || "-"}</p>
              </div>

              <div>
                <span className="md:hidden text-xs text-green-700 font-semibold">Médico:</span>
                <p>{paciente.medico || "-"}</p>
              </div>

              {/* Ações - ocupa linha inteira no mobile */}

              <div className="flex justify-start md:justify-center gap-2 flex-wrap mt-2 md:mt-0 col-span-1">
                <Link
                  to={`/avaliacaoanestesica/${paciente.id || paciente.uid}`}
                  className="p-2 border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded"
                  title="Visualizar Avaliação Anestésica"
                >
                  <TvIcon className="w-5 h-5" />
                </Link>
                <Link
                   to={`/paciente/${paciente.id || paciente.uid}`}
                  state={{ from: "/dashboard" }}
                  className="p-2 border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded"
                  title="Visualizar Paciente"
                >
                  <EyeIcon className="w-5 h-5" />
                </Link>
                <Link
                  to={`/pacient/edit/${paciente.id || paciente.uid}`}
                  className="p-2 border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white rounded"
                  title="Editar Paciente"
                >
                  <PencilSquareIcon className="w-5 h-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

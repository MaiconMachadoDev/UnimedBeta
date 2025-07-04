import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useFetchDocuments } from "../../hooks/UseFetchDocuments";
import { useDeleteDocument } from "../../hooks/useDeleteDocument";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  TvIcon
} from "@heroicons/react/24/solid";

const Dashboard = () => {
  const [sortConfig, setSortConfig] = useState(null);
  const [sortedPatients, setSortedPatients] = useState([]);
  const { documents: pacientes, loading } = useFetchDocuments("clientesCirurgia");
  const { deleteDocument } = useDeleteDocument("clientesCirurgia");

  const [showModal, setShowModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (pacientes) {
      let sorted = [...pacientes];
      if (sortConfig !== null) {
        sorted.sort((a, b) => {
          const aVal = a[sortConfig.key];
          const bVal = b[sortConfig.key];
          if (sortConfig.key === "createdAt") {
            return sortConfig.direction === "asc"
              ? (aVal?.seconds || 0) - (bVal?.seconds || 0)
              : (bVal?.seconds || 0) - (aVal?.seconds || 0);
          }
          return sortConfig.direction === "asc"
            ? String(aVal || "").localeCompare(String(bVal || ""))
            : String(bVal || "").localeCompare(String(aVal || ""));
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

  const handleConfirmDelete = () => {
    if (selectedPatientId) {
      deleteDocument(selectedPatientId);
      setShowModal(false);
      setSelectedPatientId(null);
    }
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
            <div>Data</div>
            <div>Sala</div>
            <div>Horário</div>
            <div>Médico</div>
            <div className="text-center">Ações</div>
          </div>

          {sortedPatients.map((paciente) => (
            <div
              key={paciente.id}
              className="bg-white rounded-lg shadow p-4 flex flex-col md:grid md:grid-cols-7 gap-2 md:items-center"
            >
              <div className="col-span-2">
                <span className="md:hidden text-xs text-green-700 font-semibold">Paciente:</span>
                <p className="text-green-900 font-medium">{paciente.nome}</p>
              </div>

              <div>
                <span className="md:hidden text-xs text-green-700 font-semibold">Data:</span>
                <p>{paciente.dataProcedimento ? new Date(paciente.dataProcedimento).toLocaleDateString("pt-BR") : "-"}</p>
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
                  to={`/avaliacaoanestesica/${paciente.id}`}
                  className="p-2 border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded"
                  title="Visualizar"
                >
                  <TvIcon className="w-5 h-5" />
                </Link>
                <Link
                  to={`/paciente/${paciente.id}`}
                  className="p-2 border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded"
                  title="Visualizar"
                >
                  <EyeIcon className="w-5 h-5" />
                </Link>
                <Link
                  to={`/pacient/edit/${paciente.id}`}
                  className="p-2 border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white rounded"
                  title="Editar"
                >
                  <PencilSquareIcon className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => handleDeleteClick(paciente.id)}
                  className="p-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded"
                  title="Excluir"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
     
      )}

      {/* Modal de Exclusão */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <h3 className="text-xl font-bold text-green-800 mb-4">Confirma exclusão?</h3>
            <p className="mb-4 text-green-700">
              Esta ação é irreversível. Tem certeza que deseja excluir este paciente?
            </p>
            <label className="flex items-center mb-4 text-green-800">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="mr-2"
              />
              Confirmo que quero excluir
            </label>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded border border-green-600 text-green-700 hover:bg-green-100 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={!isChecked}
                className={`px-4 py-2 rounded ${
                  isChecked ? "bg-red-600 text-white hover:bg-red-700" : "bg-red-300 text-white cursor-not-allowed"
                } transition`}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

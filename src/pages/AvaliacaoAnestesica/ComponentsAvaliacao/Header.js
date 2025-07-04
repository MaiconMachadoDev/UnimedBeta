import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetchDocument } from "../../../hooks/useFetchDocument";

const Header = () => {
  const { id } = useParams();
  const { document: paciente } = useFetchDocument("clientesCirurgia", id);

  const [nomeSocial, setNomeSocial] = useState("");
  const [nomePaciente, setNomePaciente] = useState("");
  const [nomeMae, setNomeMae] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");

  useEffect(() => {
    if (paciente) {
      setNomeSocial(paciente.nomeSocial || "");
      setNomePaciente(paciente.nome || "");
      setNomeMae(paciente.mae || "");
      setDataNascimento(paciente.nascimento || "");
    }
  }, [paciente]);

  return (
    <div>
      <h2 className="text-xl font-bold text-green-800 mb-4">Relatório de Avaliação Pré-Anestésica</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-green-700">Nome Social</label>
          <input
            type="text"
            value={nomeSocial}
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-green-700">Nome do Paciente</label>
          <input
            type="text"
            value={nomePaciente}
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-green-700">Nome da Mãe</label>
          <input
            type="text"
            value={nomeMae}
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-green-700">Data de Nascimento</label>
          <input
            type="date"
            value={dataNascimento}
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
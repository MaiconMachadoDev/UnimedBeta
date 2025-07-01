import React from 'react'
import { Link } from 'react-router-dom'
import { useFetchDocuments } from '../../hooks/UseFetchDocuments'
import { useQuery } from '../../hooks/useQuery'

const Search = () => {
  const query = useQuery()
  const search = query.get("q")

  const { documents: clientesCirurgia, loading } = useFetchDocuments("clientesCirurgia", search)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 px-4 py-10 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
        Resultados da Busca
      </h1>

      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
        {loading && (
          <p className="text-green-700 text-center font-medium col-span-full">
            Carregando...
          </p>
        )}

        {!loading && clientesCirurgia && clientesCirurgia.length === 0 && (
          <div className="text-center text-gray-600 mt-8 col-span-full">
            <p className="mb-4">Nenhum procedimento encontrado para "{search}"</p>
            <Link
              to="/"
              className="text-green-600 font-semibold hover:underline"
            >
              Voltar
            </Link>
          </div>
        )}

        {!loading && clientesCirurgia && clientesCirurgia.length > 0 && (
          <>
            {clientesCirurgia.map((clientesCirurgia) => (
              <div
                key={clientesCirurgia.id}
                className="flex flex-col text-center bg-white border border-green-200 rounded-2xl shadow-md p-3 transition hover:shadow-lg w-full sm:max-w-[375px] mx-auto space-y-1"
              >
                <h2 className="text-xl font-semibold text-green-700">
                  {clientesCirurgia.cirurgia}
                </h2>
                <p className="text-gray-700 text-sm mb-0">
                  <span className="font-semibold">Paciente:</span> {clientesCirurgia.nome}
                </p>
                <p className="text-gray-700 text-sm mb-0">
                  <span className="font-semibold">Mãe:</span> {clientesCirurgia.mae}
                </p>
                <p className="text-gray-700 text-sm mb-0">
                  <span className="font-semibold">Data Cirúrgica:</span> {clientesCirurgia.dataProcedimento}
                </p>
                <p className="text-gray-700 text-sm mb-0">
                  <span className="font-semibold">Cirurgião:</span> {clientesCirurgia.medico}
                </p>
                <p className="text-gray-700 text-sm mb-0">
                  <span className="font-semibold">Horário:</span> {clientesCirurgia.horarioCirurgia}
                </p>
                <p className="text-gray-700 text-sm mt-1 mb-0">
                  Avaliado:{" "}
                  <span className="text-sm bg-red-600 rounded-md text-white font-bold px-2 py-1 select-none">
                    Não
                  </span>
                </p>

                <div className="mr-3 flex place-items-center justify-end gap-4 mt-1">
                  <Link
                    to={`/paciente/${clientesCirurgia.id}`}
                    className="text-green-700 font-semibold hover:underline text-sm"
                  >
                    Ver
                  </Link>
                </div>
              </div>
            ))}

            <div className="col-span-full text-center mt-6">
              <Link
                to="/"
                className="text-green-600 font-semibold hover:underline"
              >
                Voltar para a página inicial
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Search
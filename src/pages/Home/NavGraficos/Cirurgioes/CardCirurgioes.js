import React from 'react'

const CardCirurgioes = ({ foto, nome, especialidade, cirurgiasMes, cirurgiasAno }) => {
  return (
     <tr className="border-b border-gray-300">
      <td className="px-4 py-3 text-sm">
        <div className="flex items-center gap-3">
          <img
            src={foto}
            alt={nome}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-gray-800 font-medium">{nome}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">{especialidade}</td>
      <td className="px-4 py-3 text-sm text-center text-blue-600">{cirurgiasMes}</td>
      <td className="px-4 py-3 text-sm text-center text-green-600">{cirurgiasAno}</td>
    </tr>
  )
}

export default CardCirurgioes
import React from 'react';

export default function CardPaciente({
  nome,
  medico,
  cirurgia,
  opme,
  raioX,
  armarioVideo,
  scopia,
  horario,
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
      <h4 className="text-lg font-semibold mb-2 text-green-900">{nome}</h4>
      <p><strong>Médico:</strong> {medico}</p>
      <p><strong>Cirurgia:</strong> {cirurgia}</p>
      <p><strong>OPME:</strong> {opme}</p>
      <p><strong>Raio X:</strong> {raioX}</p>
      <p><strong>Armário Vídeo:</strong> {armarioVideo}</p>
      <p><strong>Scopia:</strong> {scopia}</p>
      <p><strong>Horário:</strong> {horario}</p>
    </div>
  );
}

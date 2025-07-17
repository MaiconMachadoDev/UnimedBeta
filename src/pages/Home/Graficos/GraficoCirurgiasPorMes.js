import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";

const GraficoCirurgiaPorMes = ({ data }) => {
  return (
    <div className="w-full h-80 bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4 text-green-700">Cirurgias por Mês</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nome" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="cirurgias" fill="#16a34a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoCirurgiaPorMes;

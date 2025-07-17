import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";

const GraficoCirurgiaPorMes = ({ data }) => {
  return (
    <div className="w-full h-80  p-4">
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

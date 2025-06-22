import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
export default function TicketsChart({ stats }) {
  if (!stats) return null;
  const data = [
    { name: "Ouverts", value: stats.ouvert || 0 },
    { name: "Résolus", value: stats.resolu || 0 },
    { name: "En retard", value: stats.retard || 0 },
  ];
  const COLORS = ["#8b5cf6", "#38bdf8", "#ef4444"];
  return (
    <div className="bg-white rounded-2xl p-8 shadow mb-8">
      <h2 className="text-xl font-bold mb-6">Répartition des tickets</h2>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
            {data.map((entry, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

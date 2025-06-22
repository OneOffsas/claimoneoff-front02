import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
export default function TicketsChart({ stats }) {
  if (!stats) return null;
  const data = [
    { name: "Ouverts", value: stats.ouvert || 0 },
    { name: "Résolus", value: stats.resolu || 0 },
    { name: "En retard", value: stats.retard || 0 },
  ];
  const COLORS = ["#7c3aed", "#38bdf8", "#ef4444"];
  return (
    <div className="bg-white rounded-xl p-6 shadow mb-8">
      <h2 className="text-lg font-semibold mb-4">Répartition des tickets</h2>
      <ResponsiveContainer width="100%" height={250}>
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

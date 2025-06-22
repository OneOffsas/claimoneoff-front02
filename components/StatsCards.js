export default function StatsCards({ stats }) {
  if (!stats) return <div>Chargement...</div>;
  return (
    <div className="grid grid-cols-4 gap-6 mb-8">
      <Card label="Tickets total" value={stats.total} color="from-purple-400 to-blue-400" />
      <Card label="Ouverts" value={stats.ouvert} color="from-green-400 to-green-600" />
      <Card label="Résolus" value={stats.resolu} color="from-blue-400 to-violet-400" />
      <Card label="En retard" value={stats.retard} color="from-red-400 to-red-600" />
    </div>
  );
}
function Card({ label, value, color }) {
  return (
    <div className={`p-6 rounded-2xl shadow bg-gradient-to-br ${color} text-white text-center`}>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-lg">{label}</div>
    </div>
  );
}


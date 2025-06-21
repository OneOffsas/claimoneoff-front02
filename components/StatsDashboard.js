import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function StatsDashboard({ user }) {
  const [stats, setStats] = useState({ parProbleme: [], parTransporteur: [], total: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch("/api/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ societe: user.societe, role: user.role, email: user.email })
      });
      const data = await res.json();
      setStats(data.stats || {});
    };
    fetchStats();
  }, [user.societe, user.role, user.email]);

  return (
    <div>
      <h3 className="mb-4">Statistiques</h3>
      <div className="row">
        <div className="col-md-6">
          <div className="bg-white p-4 shadow-sm rounded-4 mb-4">
            <h5>Tickets par problème</h5>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.parProbleme}>
                <XAxis dataKey="probleme" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6441a5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-md-6">
          <div className="bg-white p-4 shadow-sm rounded-4 mb-4">
            <h5>Tickets par transporteur</h5>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={stats.parTransporteur} dataKey="count" nameKey="transporteur" cx="50%" cy="50%" outerRadius={70} fill="#2b43c7" label>
                  {stats.parTransporteur.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={["#6441a5", "#2b43c7", "#007aff", "#00bcd4", "#ff4081", "#ff9800"][index % 6]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 shadow-sm rounded-4 mb-4">
        <h5>Total tickets : {stats.total}</h5>
      </div>
    </div>
  );
}


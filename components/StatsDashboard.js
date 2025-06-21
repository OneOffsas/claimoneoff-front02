import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#2b43c7", "#6441a5", "#20c997", "#ffc107", "#fd7e14", "#e83e8c", "#17a2b8"];

export default function StatsDashboard({ user, admin }) {
  const [stats, setStats] = useState({ total: 0, ouverts: 0, resolus: 0, urgents: 0, data: [] });

  useEffect(() => {
    fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "getTickets",
        role: admin ? "Admin" : user.role,
        societe: user.societe,
        email: user.email
      }),
    })
      .then(r => r.json())
      .then(({ tickets }) => {
        if (!tickets) return;
        const ouverts = tickets.filter(t => t.Statut === "Ouvert").length;
        const resolus = tickets.filter(t => t.Statut === "Résolu").length;
        const urgents = tickets.filter(t => t.Urgence === "Haute").length;
        const data = [
          { name: "Ouverts", value: ouverts },
          { name: "Résolus", value: resolus }
        ];
        setStats({
          total: tickets.length,
          ouverts,
          resolus,
          urgents,
          data
        });
      });
  }, []);

  return (
    <div>
      <h2 style={{ fontWeight: 800, color: "#2b43c7" }}>Tableau de bord</h2>
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card shadow border-0 text-center p-3">
            <div style={{ fontSize: 38, fontWeight: 900, color: "#6441a5" }}>{stats.total}</div>
            <div style={{ color: "#888", fontWeight: 600 }}>Tickets créés</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow border-0 text-center p-3">
            <div style={{ fontSize: 38, fontWeight: 900, color: "#2b43c7" }}>{stats.ouverts}</div>
            <div style={{ color: "#888", fontWeight: 600 }}>Tickets ouverts</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow border-0 text-center p-3">
            <div style={{ fontSize: 38, fontWeight: 900, color: "#20c997" }}>{stats.resolus}</div>
            <div style={{ color: "#888", fontWeight: 600 }}>Tickets résolus</div>
          </div>
        </div>
      </div>
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card shadow border-0 p-4">
            <div className="mb-2" style={{ fontWeight: 700 }}>Répartition tickets</div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={stats.data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                  {stats.data.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

